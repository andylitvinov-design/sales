<?php
/** Preserve legacy query routes when Joomla inherits a new language-home style. */
defined('_JEXEC') or die;
function psitrendsLegacyRoute(array $query): string {
    unset($query['template'], $query['templateStyle']);
    $query['Itemid'] = 101;
    return '/index.php?' . http_build_query($query, '', '&', PHP_QUERY_RFC3986);
}
function psitrendsUseLegacyRoute(): void {
    $app = \Joomla\CMS\Factory::getApplication();
    if (!in_array($app->input->getMethod(), ['GET', 'HEAD'], true)
        || $app->input->getInt('Itemid') === 101) {
        throw new \RuntimeException('Unsupported client template request.', 404);
    }
    $fallback = $app->getMenu()->getItem(101);
    if (!$fallback || (int) $fallback->template_style_id === (int) $app->getTemplate(true)->id) {
        throw new \RuntimeException('Legacy template route unavailable.', 404);
    }
    $query = \Joomla\CMS\Uri\Uri::getInstance()->getQuery(true);
    foreach (['option', 'view', 'layout', 'id', 'lang'] as $name) {
        $value = $app->input->getString($name, '');
        if ($value !== '') { $query[$name] = $value; }
    }
    $app->redirect(psitrendsLegacyRoute($query), 302);
    $app->close();
}
