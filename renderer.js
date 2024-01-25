// document.addEventListener('DOMContentLoaded', () => {
//     const btnBaterEntrada = document.getElementById('btnBaterEntrada');
//     const btnBaterIntervalo = document.getElementById('btnBaterIntervalo');
//     const btnBaterSaida = document.getElementById('btnBaterSaida');

//     const entradaInput = document.getElementById('entrada');
//     const intervaloInput = document.getElementById('intervalo');
//     const fimIntervaloInput = document.getElementById('fimIntervalo');
//     const saidaInput = document.getElementById('saida');

//     let entrada, intervalo, fimIntervalo, saida;

//     btnBaterIntervalo.disabled = true;
//     btnBaterSaida.disabled = true;

//     btnBaterEntrada.addEventListener('click', () => {
//         entrada = new Date().toLocaleTimeString();
//         entradaInput.value = entrada;
//         btnBaterEntrada.disabled = true;
//         btnBaterIntervalo.disabled = false;
//     });

//     btnBaterIntervalo.addEventListener('click', () => {
//         if (btnBaterIntervalo.textContent === 'Intervalo') {
//             intervalo = new Date().toLocaleTimeString();
//             intervaloInput.value = intervalo;
//             btnBaterIntervalo.textContent = 'Fim do Intervalo';
//         } else {
//             fimIntervalo = new Date().toLocaleTimeString();
//             fimIntervaloInput.value = fimIntervalo;
//             btnBaterSaida.disabled = false;
//             btnBaterIntervalo.textContent = 'Intervalo';
//         }
//     });

//     btnBaterSaida.addEventListener('click', () => {
//         saida = new Date().toLocaleTimeString();
//         saidaInput.value = saida;
//         btnBaterSaida.disabled = true;
//         btnBaterEntrada.disabled = false;
//         btnBaterIntervalo.disabled= true;
//     });
// });
const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    const btnBaterEntrada = document.getElementById('btnBaterEntrada');
    const btnBaterIntervalo = document.getElementById('btnBaterIntervalo');
    const btnBaterSaida = document.getElementById('btnBaterSaida');

    const entradaInput = document.getElementById('entrada');
    const intervaloInput = document.getElementById('intervalo');
    const fimIntervaloInput = document.getElementById('fimIntervalo');
    const saidaInput = document.getElementById('saida');

    let entrada, intervalo, fimIntervalo, saida;

    btnBaterIntervalo.disabled = true;
    btnBaterSaida.disabled = true;

    btnBaterEntrada.addEventListener('click', () => {
        entrada = new Date().toLocaleTimeString();
        entradaInput.value = entrada;
        btnBaterEntrada.disabled = true;
        btnBaterIntervalo.disabled = false;
    });

    btnBaterIntervalo.addEventListener('click', () => {
        if (btnBaterIntervalo.textContent === 'Intervalo') {
            intervalo = new Date().toLocaleTimeString();
            intervaloInput.value = intervalo;
            btnBaterIntervalo.textContent = 'Fim do Intervalo';
        } else {
            fimIntervalo = new Date().toLocaleTimeString();
            fimIntervaloInput.value = fimIntervalo;
            btnBaterSaida.disabled = false;
            btnBaterIntervalo.textContent = 'Intervalo';
        }
    });

    btnBaterSaida.addEventListener('click', () => {
        saida = new Date().toLocaleTimeString();
        saidaInput.value = saida;
        btnBaterSaida.disabled = true;
        btnBaterEntrada.disabled = false;
        btnBaterIntervalo.disabled = true;
        const dataAtualString = new Date().toISOString();
        const dataFormatada = dataAtualString.substring(0, 10); 
        let data = dataFormatada
        // Gravar no banco de dados

        const dadosParaBanco = {
            horaentrada: entrada,
            intervalo: intervalo,
            fimintervalo: fimIntervalo,
            horasaida: saida,
            data: data,

        };

        const { ipcRenderer } = require('electron');
        ipcRenderer.send('gravarNoBanco', dadosParaBanco);
        // ipcRenderer.on('gravarNoBancoSucesso', () => {
        //     console.log('Dados gravados com sucesso no renderer process.');
        // });
        
        // ipcRenderer.on('gravarNoBancoErro', (event, mensagemErro) => {
        //     console.error('Erro ao gravar no banco no renderer process:', mensagemErro);
        // });
    });
});
