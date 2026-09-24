// Read-only localhost view of isolated staging over the existing authorized SSH command path.
// No public listener, admin access, form submission, or server security changes.
import http from 'node:http';
import {execFile} from 'node:child_process';
const port=8880;
http.createServer((req,res)=>{
 const url=new URL(req.url,`http://127.0.0.1:${port}`);
 if(!['GET','HEAD'].includes(req.method)||url.pathname.includes('administrator')||url.pathname.includes('..')){res.writeHead(403);res.end();return;}
 const target=`http://172.25.0.4${url.pathname}${url.search}`;
 const quote=value=>`'${value.replaceAll("'","'\\''")}'`;
 execFile('ssh',['-o','BatchMode=yes','psitrends-production',`curl --max-time 20 --silent --show-error --include --header ${quote(`Host: 127.0.0.1:${port}`)} ${quote(target)}`],{encoding:'buffer',maxBuffer:8*1024*1024},(error,out)=>{
  if(error){res.writeHead(502);res.end('Staging connection failed');return;}
  const split=out.indexOf('\r\n\r\n');if(split<0){res.writeHead(502);res.end();return;}
  const lines=out.subarray(0,split).toString().split('\r\n');const code=Number(lines.shift().split(' ')[1]);
  for(const line of lines){const at=line.indexOf(':');const name=line.slice(0,at).toLowerCase();if(['content-type','location','x-robots-tag','content-security-policy','cache-control'].includes(name))res.setHeader(name,line.slice(at+1).trim());}
  res.writeHead(code);res.end(req.method==='HEAD'?undefined:out.subarray(split+4));
 });
}).listen(port,'127.0.0.1',()=>console.log(`Staging read-only preview: http://127.0.0.1:${port}`));
