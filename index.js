// Importando puppeteer
const puppeteer = require('puppeteer')

// variável que recebe a URL da página dos Correios
var url = 'https://buscacepinter.correios.com.br/app/endereco/index.php';

// variável que recebe o cep que será buscado
var cep = '60025002';

// função anônima assíncrona, que vai permitir acessar o potencial da ferramenta.
let cepCorreios = async () => {
    const browser = await puppeteer.launch({headless: false});

    // inicia uma nova página para a navegação
    const page = await browser.newPage();

    // acessa a url informada na promisse
    await page.goto(url)

    // carrega as dimensões padrão ou personalizadas
    await page.setViewport({
        width: 1200,
        height: 720,
    });

    // altera o tempo limite padrão de navegação
    // espera de 2000 milissegundos
    await page.waitForTimeout(2000);

    // invoca o evento click no elemento passando para a função a referência id; input de buscar o cep.
    await page.click('#endereco');

    // digita o dado na variável 'cep' no campo clicado anteriormente
    await page.keyboard.type(cep);

    // espera de 2000 milissegundos para invocar o envento click a seguir
    await page.waitForTimeout(2000);

    // invoca o evento click no elemento com o id como referência; butão 'Buscar'.
    await page.click('#btn_pesquisar');

    // após carregar a página com a informação obtida do cep, o '.waitForTimeout' realizará uma espera de 3000 milissegundos para o próximo passo
    await page.waitForTimeout(3000);

    // Screenshot é uma função que gera imagens
    await page.screenshot({
        path: 'correios.jpg',
    });

    // epera de 2000 milissegundos para fechar a página e carregar o array com a informação obtida
    await page.waitForTimeout(2000);

    console.log('Endereço carregado com sucesso...');

    // O page.evaluate é para rodar o JavaScript no navegador como se alguém estivesse no controle.
    let endereco = await page.evaluate(() => {
        // array que irá armazenar os dados completos obtidos na busca do cep
        let list_endereco = [];

        document.querySelectorAll("#resultado-DNEC > tbody > tr > td").forEach(
            (end_) => list_endereco.push(end_.outerText)
        );
                
        // Retorno da lista com todos os dados do cep pesquisado
        return list_endereco;
    });
    

    // Fecha a instância iniciada no '.launch()'.
    await browser.close();

    // Retorna a 'function' do endereço
    return endereco;
};

cepCorreios().then((result) => {
    console.log(result);
});