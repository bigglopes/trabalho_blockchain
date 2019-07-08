const path = require('path');
const Web3 = require("web3");

const ata_abi = require(path.resolve("../dapp/build/contracts/ReuniaoContract.json"));
const httpEndpoint = 'http://localhost:8540';

let contractAddress = '0xe3834467FB044f6221a9fA447CFD5200e121fd21';

const OPTIONS = {
    defaultBlock: "latest",
    transactionConfirmationBlocks: 1,
    transactionBlockTimeout: 5
};

let web3 = new Web3(httpEndpoint, null, OPTIONS);

let AtaContract = new web3.eth.Contract(ata_abi.abi, contractAddress);

module.exports = {
    exibirRegistroAta: function(req, res) {

        // verifica se usuario esta logado
        if (!req.session.username) {
            res.redirect('/api/auth');
            res.end();
        } else {
            res.render('novaAta.html');
        }
    },
    listarAtasReuniao: function(req, res) {

        // verifica se usuario esta logado
        if (!req.session.username) {
            res.redirect('/api/auth');
            res.end();
        } else {
            res.render('listaAtas.html');
        }
    },
    listarAtasRegistradas: async function(req, res) {

        let userAddr = req.session.address;
        console.log("*** Recuperando dados de atas na blockchain ***", userAddr);

        await AtaContract.methods.listarAtas()
            .call({ from: userAddr, gas: 3000000 })
            .then(function (result) {

                console.log("resultado da blockchain", result);
                if (result === null) {
                    return res.send({ error: false, msg: "sem registros"});
                }

                let atas = [];
                for (i = 0; i < result['0'].length; i++) {
                    atas.push({ 'id': +result['0'][i], 'titulo': result['1'][i], 'addr': result['2'][i], 'resumo': result['3'][i] , 'datareuniao': result['4'][i]});
                }

                console.log("atas de reuniao", atas);

                res.send({ error: false, msg: "atas recuperadas com sucesso", atas});
                return true;
            })
            .catch(error => {
                console.log("*** atasapi -> recuperar atas de reuniao ***error:", error);
                res.send({ error: true, msg: error});
            })
        
    },
    registrarAta: async function(req, res) {

        if (!req.session.username) {
            res.redirect('/');
            res.end();
        } else {
            console.log("*** Ataapi -> Registrar Ata ***");
            console.log(req.body);

            let titulo = req.body.titulo;
            let resumo   = req.body.resumo;
            let userAddr = req.session.address;
            let pass     = req.session.password;
            let datareuniao = req.body.datareuniao;

            try {
                let accountUnlocked = await web3.eth.personal.unlockAccount(userAddr, pass, null)
                if (accountUnlocked) {

                    await AtaContract.methods.registrarAta(titulo, resumo , datareuniao)
                        .send({ from: userAddr, gas: 3000000 })
                        .then(function(result) {
                            console.log(result);
                            return res.send({ 'error': false, 'msg': 'Ata registrada com sucesso.'});  
                        })
                        .catch(function(err) {
                            console.log(err);
                            return res.send({ 'error': true, 'msg': 'Erro ao comunicar com o contrato.'});
                        })
                } 
            } catch (err) {
                return res.send({ 'error': true, 'msg': 'Erro ao desbloquear sua conta. Por favor, tente novamente mais tarde.'});
            }
        }
    },
    registrarComentario: async function(req, res) {

        if (!req.session.username) {
            res.redirect('/');
            res.end();
        } else {
            console.log("*** Ataapi -> Registrar Comentario ***");
            console.log(req.body);

            let idata = req.body.idata;
            let comentario = req.body.comentario;
            let userAddr = req.session.address;
            let pass     = req.session.password;
        
            try {
                let accountUnlocked = await web3.eth.personal.unlockAccount(userAddr, pass, null)
                if (accountUnlocked) {

                    await AtaContract.methods.comentarAta( idata, comentario )
                        .send({ from: userAddr, gas: 3000000 })
                        .then(function(result) {
                            console.log(result);
                            return res.send({ 'error': false, 'msg': 'Comentario registrado com sucesso.'});  
                        })
                        .catch(function(err) {
                            console.log(err);
                            return res.send({ 'error': true, 'msg': 'Erro ao comentar a ata.'});
                        })
                } 
            } catch (err) {
                return res.send({ 'error': true, 'msg': 'Erro ao desbloquear sua conta. Por favor, tente novamente mais tarde.'});
            }
        }
    },
    listarComentarios: async function(req, res) {

        let userAddr = req.session.address;
        let idata = req.body.idata;
        console.log("*** Recuperando dados de comentarios na blockchain ***", userAddr );
        console.log( "*** id da ata", idata );

        await AtaContract.methods.listarComentarios( idata )
            .call({ from: userAddr, gas: 3000000 })
            .then(function (result) {

                console.log("resultado da blockchain", result);
                if (result === null) {
                    return res.send({ error: false, msg: "sem registros"});
                }

                let comentarios = [];
                for (i = 0; i < result.length; i++) {
                    comentarios.push({ 'descricao': result[i] });
                }

                console.log("comentario das ata de reuniao", comentarios);

                res.send({ error: false, msg: "comentario recuperados com sucesso", comentarios});
                return true;
            })
            .catch(error => {
                console.log("*** atasapi -> recuperar comentarios ***error:", error);
                res.send({ error: true, msg: error});
            })
        
    }
}