import './style.scss';

function getTemplate() {
  return `<h1>Ciao mondo!</h1>
`;
}

function renderPage(tagName: string) {
    const el: any = document.getElementsByTagName(tagName)[0];
    el.innerHTML = getTemplate();
}

renderPage('app-root');