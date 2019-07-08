pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract ReuniaoContract {

    // evento para notificar que ata foi cadastrada com sucesso
    event ataCadastradaSucesso(uint id);

    //evento para notificar que o comentario foi registrado com sucesso
    event comentarioCadastradoComSucesso( uint id );

    // estrutura para manter dados da ata de reuniao
    struct Ata {
        uint id;
        string titulo;
        string resumo ;
        address owner;
        string datareuniao;
        
    }

    //estrutura para manter comentario de uma ata
    struct Comentario 
    {
        uint id ;
        uint idata;
        string descricao;
        address owner;
    }

     // mapeia um id a uma ata
    mapping (uint => Ata) atas;
    uint[] public atasIds;
    mapping (uint => Comentario) comentarios;
    uint [] public comentariosIds;
    uint public ultimoIdAta =0 ;
    uint public ultimoIdComentario = 0;



    // função para cadastrar ata de reuniao
    function registrarAta(string memory titulo, string memory resumo , string memory datareuniao ) public {
        require(bytes( titulo ).length >= 1, "Titulo de ata invalido");
        require(bytes( resumo ).length >= 1, "Resumo de reuniao invalido");
        require(bytes( datareuniao ).length >= 1, "Data de reuniao invalida");

        atas[ultimoIdAta] = Ata(ultimoIdAta, titulo ,  resumo , msg.sender , datareuniao );
        atasIds.push(ultimoIdAta);
        ultimoIdAta++;
        emit ataCadastradaSucesso(ultimoIdAta);
    }

     // função para comentar uma ata  de reuniao
    function comentarAta( uint idata , string memory comentario  ) public {
        require(bytes( comentario ).length >= 1, "Comentario invalido");
        
        comentarios[ultimoIdComentario] = Comentario(ultimoIdComentario, idata ,  comentario , msg.sender);
        comentariosIds.push(ultimoIdComentario);
        ultimoIdComentario++;
        emit comentarioCadastradoComSucesso(ultimoIdComentario);
    }

     //funcao para listar todas atas de reuniao
    function listarAtas() public view returns(uint[] memory, string[] memory, address[] memory, string[] memory , string []memory) {

        uint qtde = atasIds.length ;

        uint[] memory ids = new uint[]( qtde );
        string[] memory titulos = new string[]( qtde );
        address[] memory owners = new address[]( qtde );
        string[] memory resumos = new string[]( qtde );
        string[] memory datasreuniao = new string []( qtde );

        for (uint i = 0; i < qtde; i++) {
            (ids[i], titulos[i], owners[i], resumos[i] , datasreuniao[i]) = recuperarInformacoesAta(i);
        }

        return (ids, titulos, owners, resumos , datasreuniao);
    }

    function listarComentarios(  uint idata ) public view returns ( string [] memory   )
    {
        uint qtde = 0;

       for( uint i =0 ; i < comentariosIds.length;  i++ )
        {
            uint id = comentariosIds[ i ];
            Comentario memory comment = comentarios[ id ];
            if( comment.idata == idata )
                qtde++;
        }

       string[] memory result = new string[]( qtde );

         uint j = 0;
        for( uint i =0 ; i < comentariosIds.length;   i++ )
        {
            uint id = comentariosIds[ i ];
            Comentario memory comment = comentarios[ id ];
             if( comment.idata == idata )
             {
                  result[ j ]=comment.descricao;
                  j++;
             }
        }


       return result;
    }

    // função para resgatar info de uma ata
    function recuperarInformacoesAta(uint _id) public view
        returns(
            uint,
            string memory,
            address,
            string memory ,
            string memory
        ) {
            require(_id <= ultimoIdAta, "Ata inexistente");

            Ata memory ata = atas[_id];

            return (
                ata.id,
                ata.titulo,
                ata.owner,
                ata.resumo , 
                ata.datareuniao
            );
    }




}