const packages = [
  { setup: 2999, monthly: 399 },
  { setup: 7999, monthly: 999 },
  { setup: 14999, monthly: 1999 },
];

const extras = [
  { id: 'shop', label: 'Online store', price: 3500 },
  { id: 'copy', label: 'Copywriting', price: 1200 },
  { id: 'brand', label: 'Brand starter kit', price: 1800 },
];

const packageSelect = document.querySelector('#package');
const setup = document.querySelector('#setup');
const monthly = document.querySelector('#monthly');
const form = document.querySelector('#lead');
const whatsappQuote = document.querySelector('#whatsapp-quote');
const whatsappContact = whatsappQuote.href;
const money = amount => 'R' + amount.toLocaleString('en-ZA');

function updateQuote() {
  const selectedPackage = packages[Number(packageSelect.value)];
  const selectedExtras = extras.filter(extra => document.getElementById(extra.id).checked);
  const total = selectedExtras.reduce((sum, extra) => sum + extra.price, selectedPackage.setup);
  setup.textContent = money(total);
  monthly.textContent = money(selectedPackage.monthly);
  const quote = [
    'Package: ' + packageSelect.selectedOptions[0].textContent,
    'Extras: ' + (selectedExtras.map(extra => extra.label + ' (+' + money(extra.price) + ')').join(', ') || 'None'),
    'Estimated once-off setup: ' + setup.textContent,
    'Estimated monthly: ' + monthly.textContent,
  ];
  const message = [
    'Hi PIXELPUNK! I’d like a written quote for this project.',
    '',
    ...quote,
  ].join('\n');
  whatsappQuote.href = whatsappContact + '?text=' + encodeURIComponent(message);
  return quote;
}

document.querySelector('#quote').addEventListener('change', updateQuote);
window.addEventListener('pageshow', updateQuote);
updateQuote();

document.querySelectorAll('[data-package]').forEach(link => {
  link.addEventListener('click', () => {
    packageSelect.value = link.dataset.package;
    updateQuote();
  });
});

form.addEventListener('submit', event => {
  event.preventDefault();
  const quote = updateQuote();
  const fields = new FormData(form);
  const brief = [
    'PIXELPUNK project brief',
    '',
    'Name: ' + fields.get('name'),
    'Email: ' + fields.get('email'),
    'Business: ' + fields.get('business'),
    ...quote,
    '',
    'Project details',
    fields.get('details'),
  ].join('\n');

  const url = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'pixelpunk-project-brief.txt';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

form.querySelector('button').disabled = false;
