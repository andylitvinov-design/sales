<?php
/** Reviewed article body; edit with the native administrator article editor. */
defined('_JEXEC') or die;
use Joomla\CMS\Factory;

// Retain the core full-article access gate; do not expose restricted fulltext
// when com_content is configured to show an unauthenticated teaser.
if (!$this->item->params->get('access-view')) {
    throw new \RuntimeException('Article access denied.', 403);
}
$key = (string) Factory::getApplication()->getTemplate(true)->params->get('page_key', '');
$expectedAlias = 'psitrends-client-' . str_replace(':', '-', $key);
if (!$key || $this->item->alias !== $expectedAlias) {
    throw new \RuntimeException('Client article assignment mismatch.', 404);
}
// No prepared-content plugin wrappers, article chrome, or extra H1/main.
echo $this->item->introtext;
if (!empty($this->item->fulltext)) {
    echo $this->item->fulltext;
}
