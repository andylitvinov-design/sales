# STATE

- current goal: использовать `sales` как простой cloud-ready набор лендингов с одной понятной публичной точкой входа
- current task: зафиксировать канонический deploy и сократить хаос между вариантами страниц
- repo role: runtime-витрина продающих страниц; здесь лежат конкретные HTML/CSS лендинги, CTA, секции, deploy и quality-check
- architecture boundary: `andrey-system` хранит бизнес-упаковку и офферы; `alchemy-method` хранит метод; `sales` публикует это как продающие страницы
- working rule: не создавать новую страницу, если можно улучшить текущий канонический лендинг
- canonical landing: `landing-services-bwa-photo.html`
- canonical deploy: `https://sales-bwa-photo.pages.dev/`
- next step: выбрать основной лендинг, подключить GitHub browser editing и продолжать работу от него, а не от всех вариантов сразу
