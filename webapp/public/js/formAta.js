window.addEventListener("load", function() {

    
    // restaga formulário de produtos
    let form = document.getElementById("formAta");

    // adiciona uma função para
    // fazer o login quando o 
    // formulário for submetido
    form.addEventListener('submit', registrarAta);

   
})

function registrarAta() {

    // previne a página de ser recarregada
    event.preventDefault();

    $('#load').attr('disabled', 'disabled');

    // resgata os dados do formulário
    let titulo = $("#titulo").val();
    let resumo = $("#resumo").val();
    let datareuniao = $("#datareuniao").val();

   
    // envia a requisição para o servidor
    $.post("/registrarAta", {titulo: titulo,  resumo: resumo , datareuniao: datareuniao }, function(res) {
        
        console.log(res);
       
        // verifica resposta do servidor
        if (!res.error) {
            console.log("*** Views -> js -> formata.js -> registroata: ***", res.msg);            
            // limpa dados do formulário
            $("#titulo").val("");
            $("#resumo").val("");
            $("#datreuniao").val("");
            
            // remove atributo disabled do botao
            $('#load').attr('disabled', false);

            alert("Ata registrada com sucesso");
        } else {
            alert("Erro ao registrar ata " + res.msg);
        }

    });
    
}