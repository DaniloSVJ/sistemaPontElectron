const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
var moment = require('moment'); // require
// Crie ou abra o banco de dados SQLite
const dbPath = path.join(app.getPath('userData'), 'bancohoras.db');
const db = new sqlite3.Database(dbPath);
console.log('Caminho do banco de dados:', dbPath); // Adicione esta linha

// Crie a tabela se não existir
db.run(`
    CREATE TABLE IF NOT EXISTS bancohoras (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        horaentrada TEXT,
        intervalo TEXT,
        fimintervalo TEXT,
        horasaida TEXT,
        data TEXT
    )
`);
console.log('dfdf1111')
function createWindow() {
    console.log('dfdf2222')
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'renderer.js')

        },

    });

    win.loadFile('index.html');

    // Fechar o banco de dados quando a janela for fechada
    console.log('dfdf3333')


    ipcMain.on('gravarNoBanco', (event, dados) => {

        db.get('SELECT horastrabalhada FROM bancohoras WHERE data = ?', [dados.data], (err, row) => {
            if (err) {
                console.error(err.message);
                event.sender.send('obterValorPorIdErro', err.message);
            } else {
                let horastrabalhada = '0:00:00'
                let qtdHorasTrabalhadas = '0:00:00'
                if (row) {
                    console.log('544456465454564564>>>>  ' + row.horastrabalhada)
                    horastrabalhada = String(row.horastrabalhada);
                    console.log('54445646545456>>  ' + horastrabalhada)

                    const qtdHT1 = calcularDiferencaHorasSimples('08:00:00', '12:00:00')
                    const qtdHT2 = calcularDiferencaHorasSimples('08:00:00', '12:00:00')
                    qtdHorasTrabalhadas = somarhoras(qtdHT1, qtdHT2)
                    qtdHorasTrabalhadas = somarhoras(qtdHorasTrabalhadas, horastrabalhada)
                    db.run('UPDATE bancohoras SET horaentrada=?, intervalo=?, fimintervalo=?, horasaida=?,horastrabalhada=? WHERE data = ?'
                        , [dados.horaentrada, dados.intervalo, dados.fimintervalo, dados.horasaida, qtdHorasTrabalhadas, dados.data], (err) => {

                            if (err) {
                                console.error(err.message);
                                // Trate o erro aqui, se necessário
                            } else {
                                console.log('Atualização realizada com sucesso!');
                                // Faça algo após a atualização, se necessário
                            }
                        });
                } else {
                    const qtdHT1 = calcularDiferencaHorasSimples(dados.horaentrada, dados.intervalo)
                    const qtdHT2 = calcularDiferencaHorasSimples(dados.fimintervalo, dados.horasaida)
                    qtdHorasTrabalhadas = somarhoras(qtdHT1, qtdHT2)
                    qtdHorasTrabalhadas = somarhoras(qtdHorasTrabalhadas, horastrabalhada)
                    console.log('veio no update>>  ' + horastrabalhada)
                    db.run(`
                    INSERT INTO bancohoras 
                    (horaentrada, intervalo, fimintervalo, horasaida,data,horastrabalhada) 
                    VALUES (?, ?, ?, ?, ?, ?)
                    `, [dados.horaentrada, dados.intervalo, dados.fimintervalo, dados.horasaida, dados.data, qtdHorasTrabalhadas], (err) => {
                        if (err) {
                            console.error('Erro ao gravar no banco:', err.message);
                            event.sender.send('gravarNoBancoErro', err.message);
                        } else {
                            console.log('Dados gravados com sucesso!');
                            event.sender.send('gravarNoBancoSucesso');
                        }
                    });

                }
            }
        });

    });



    win.on('closed', () => {
        db.close();
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
function calcularDiferencaHorasSimples(horaInicio, horaFim) {
    const dataAtualString = new Date().toISOString();
    const dataFormatada = dataAtualString.substring(0, 10); // Corta a partir da posição 0 até a posição 9
    console.log(dataFormatada); // Saída: "2024-01-25"
    // Converte as strings de hora para objetos Date
    const inicio = new Date(`${dataFormatada}T${horaInicio}`);
    const fim = new Date(`${dataFormatada}T${horaFim}`);
    var ms = moment(fim, "DD/MM/YYYYTHH:mm:ss").diff(moment(inicio, "DD/MM/YYYYTHH:mm:ss"));
    var d = moment.duration(ms);
    var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");

    // Calcula a diferença em milissegundos

    console.log('trabalhou: ' + s)
    return s;
}

function somarhoras(horainicio, horafim) {
    console.log('horainicio:'+horainicio)
    console.log('horafim:'+horafim)
    const intervaloTempo = horafim;
    const horaInicial = moment(horainicio, 'HH:mm:ss');



    // Convertendo o intervalo para um objeto duration do moment.js
    const duracaoIntervalo = moment.duration(intervaloTempo);
    const horaFinal = horaInicial.clone().add(duracaoIntervalo);
    console.log('horaFinal:'+horaFinal.format('HH:mm:ss'))
    return horaFinal.format('HH:mm:ss')
}