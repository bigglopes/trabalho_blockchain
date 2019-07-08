window.addEventListener("load", function() {

    // função para carregar produtos
    listarAtas();
})

function comentarAta( idata ) {

    // previne a página de ser recarregada
    event.preventDefault();

   
    // resgata os dados do formulário
    let comentario = $("#txt" + idata ).val();
   
    // envia a requisição para o servidor
    $.post("/comentarAta", {idata: idata,  comentario: comentario }, function(res) {
        
        console.log(res);
       
        // verifica resposta do servidor
        if (!res.error) {
            console.log("*** Views -> js -> formata.js -> registro de comentario: ***", res.msg);            
           
            alert("Comentario registrado com sucesso");
        } else {
            alert("Erro ao comentar ata " + res.msg);
        }

    });
    
}

function exibirPanel( panelid )
{
     $('#painelcomentario' + panelid ).show();
}

function verComentarios( idata )
{
     // envia a requisição para o servidor
     $.post("/listarComentarios", {idata: idata  }, function(res) {
        
        console.log(res);
       
        // verifica resposta do servidor
        if (!res.error) {
            console.log("*** Views -> js -> formata.js -> listagem de comentarios: ***", res.msg);            
           
            let comentarios = res.comentarios;

            let todoscomentarios = 'Comentários registrados anteriormente: <br><br>';
            for( let i = 0 ; i < comentarios.length ; i++ )
            {
                let descricao = comentarios[i].descricao;
                todoscomentarios += descricao + '<br>';
            }

            $( '#comentarios' + idata ).html( todoscomentarios  );

        } else {
            alert("Erro ao recuperar comentarios da ata " + res.msg);
        }

    });
}


function definirresumo( resumo )
{
    document.getElementById( "resumoid").innerHTML = resumo;
}

function listarAtas() {
    console.log("*** Listar atas registradas ***");

    $.get("/listarAtasRegistradas", function(res) {
        
        if (!res.error) {
            console.log("*** Views -> js -> listaratas.js -> recuperarListas: ***", res.msg);

            if (res.msg === "sem registros") {
                return;
            }

            let atas = res.atas;

            // adiciona produtos na tabela
            for (let i = 0; i < atas.length; i++) {
                let newRow = $("<tr>");
                let cols = "";
                let idata = atas[i].id;
                let titulo = atas[i].titulo;
                let resumo = "'"+atas[i].resumo +"'";
                let owner = atas[i].addr;
                let datareuniao = atas[i].datareuniao;

                cols += '';
                cols += `<td> ${titulo} </td>`;
               // cols += `<td> ${resumo} </td>`;
                cols += `<td> ${datareuniao} </td>`;
               // cols += `<td> ${owner.substring(1, 10)} </td>`;
                cols += '<td><input type="button" class="btn btn-primary" value="Comentar" onclick="exibirPanel('+idata + ')" />'; 
                cols += '</td>';
                cols += '<td><input type="button" class="btn btn-primary" value="Comentários" onclick="verComentarios('+idata + ')" />'; 
                cols += '</td>';
                cols += '<td><button type="button" onclick="definirresumo('+ resumo +  ')" class="btn btn-primary" data-toggle="modal" data-target="#myModal">Ver Ata</button> </td>';

                newRow.append(cols);
                $("#atas-table").append(newRow);
                newRow = $("<tr>");
                
                cols = '<td colspan="4" style="display:none" id="painelcomentario'+ atas[i].id  + '">';
                cols += '<textarea id="txt'+ atas[i].id+'" rows="4" cols="40" class="form-control"  required ></textarea>';
                cols += '<br> <input type="button" class="btn btn-primary" value="Gravar" onclick="comentarAta( '+ idata + ')" />';
                cols += '</td>';
                newRow.append( cols );
                $("#atas-table").append(newRow);

                newRow = $("<tr>");
                cols = '<td colspan="4"><div id="comentarios' + atas[i].id + '" ></td>';
                newRow.append( cols );
                $("#atas-table").append(newRow);
            }
            
        } else {
            alert("Erro ao resgatar produtos do servidor. Por favor, tente novamente mais tarde. " + res.msg);
        }

    })
}