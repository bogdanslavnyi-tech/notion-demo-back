/** Trusted, checked-out workflow helper. Sends one ticket status card to Teams. */
module.exports = async function sendTeams({ webhookUrl, core, ticket, ticketId, status, repository = 'Backend', prUrl, releasePrUrl, event }) {
  if (!webhookUrl) {
    core.warning('TEAMS_WEBHOOK_URL is not configured; Notion was updated, Teams notification skipped.');
    return;
  }

  const titleProperty = Object.values(ticket.properties || {}).find(p => p?.type === 'title');
  const title = titleProperty?.title?.map(t => t.plain_text || t.text?.content || '').join('') || ticketId;
  const normalized = status.toLowerCase();
  const style = normalized === 'done' ? 'good'
    : normalized === 'in qa' || normalized === 'ready for merge' ? 'warning'
    : normalized === 'ci failed' ? 'attention' : 'accent';
  const label = status.toUpperCase();
  const text = v => String(v ?? '').slice(0, 500);
  const facts = [
    { title: 'Ticket', value: ticketId },
    { title: 'Repository', value: repository },
    { title: 'Status', value: status },
  ];
  const buttons = [{ type: 'Action.OpenUrl', title: 'Open Notion', url: ticket.url }];
  if (prUrl?.startsWith('https://github.com/')) buttons.unshift({ type: 'Action.OpenUrl', title: 'View PR', url: prUrl });
  if (releasePrUrl?.startsWith('https://github.com/') && releasePrUrl !== prUrl) {
    buttons.push({ type: 'Action.OpenUrl', title: 'Release PR', url: releasePrUrl });
  }
  const card = {
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
    type: 'AdaptiveCard', version: '1.4',
    body: [
      { type: 'Container', style, bleed: true, items: [
        { type: 'TextBlock', text: label, weight: 'Bolder', wrap: true },
      ] },
      { type: 'TextBlock', text: text(title), size: 'Large', weight: 'Bolder', wrap: true },
      { type: 'TextBlock', text: text(event), wrap: true, isSubtle: true },
      { type: 'FactSet', facts },
    ], actions: buttons,
  };
  const payload = { type: 'message', attachments: [
    { contentType: 'application/vnd.microsoft.card.adaptive', contentUrl: null, content: card },
  ] };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      core.warning(`Teams notification for ${ticketId} failed: HTTP ${response.status}`);
    } else {
      core.info(`Teams notified: ${ticketId} → ${status}`);
    }
  } catch (error) {
    core.warning(`Teams notification for ${ticketId} failed: ${error.message}`);
  }
};
