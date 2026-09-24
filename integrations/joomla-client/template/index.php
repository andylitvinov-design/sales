<?php
/** Separate client template; Joomla retains native routing and article ACL. */
defined('_JEXEC') or die;
use Joomla\CMS\Factory;
use Joomla\CMS\Uri\Uri;

$app = Factory::getApplication();
$key = (string) $this->params->get('page_key', '');
$pages = json_decode(file_get_contents(__DIR__ . '/pages.json'), true, 512, JSON_THROW_ON_ERROR);
if (!isset($pages[$key]) || $app->input->getCmd('option') !== 'com_content'
    || $app->input->getCmd('view') !== 'article' || $app->input->getCmd('layout') === 'edit') {
    require_once __DIR__ . '/legacy-route.php';
    psitrendsUseLegacyRoute();
}
$page = $pages[$key];
$uri = Uri::getInstance();
$production = $this->params->get('release_mode', 'preview') === 'production'
    && $uri->getHost() === 'psitrends.com' && $uri->getScheme() === 'https';
if (!$production) {
    $app->setHeader('X-Robots-Tag', 'noindex, nofollow', true);
}
$escape = static fn($value) => htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$assets = rtrim(Uri::root(true), '/') . '/media/templates/site/psitrends_client/assets/';
// Shell and article markup are reviewed source. No Helix modules, head scripts,
// prepared-content plugin events, or legacy GTM custom code are imported here.
?>
<!DOCTYPE html>
<html lang="<?= $escape($page['locale']) ?>">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" href="data:,">
<title><?= $escape($page['title']) ?></title>
<meta name="description" content="<?= $escape($page['description']) ?>">
<meta name="robots" content="<?= $production ? 'index, follow' : 'noindex, nofollow' ?>">
<?php if ($production) : ?>
<link rel="canonical" href="<?= $escape($page['canonical']) ?>">
<?php foreach ($page['alternates'] as $language => $url) : ?>
<link rel="alternate" hreflang="<?= $escape($language) ?>" href="<?= $escape($url) ?>">
<?php endforeach; ?>
<?php endif; ?>
<meta property="og:title" content="<?= $escape($page['title']) ?>">
<meta property="og:description" content="<?= $escape($page['description']) ?>">
<meta property="og:type" content="website">
<meta property="og:url" content="<?= $escape($page['canonical']) ?>">
<link rel="stylesheet" href="<?= $escape($assets) ?>psitrends-client.css?v=6">
<script src="<?= $escape($assets) ?>psitrends-client.js?v=6" defer></script>
<?php if ($production && $page['schema']) : ?>
<script type="application/ld+json"><?= json_encode($page['schema'], JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?></script>
<?php endif; ?>
</head>
<body data-analytics-mode="<?= $production ? 'consent' : 'off' ?>" data-page="<?= $escape($page['page']) ?>" data-locale="<?= $escape($page['locale']) ?>">
<?= $page['before'] ?>
<main id="main"><jdoc:include type="component" /></main>
<?= $page['after'] ?>
</body>
</html>
