const getLocalStorage = () => JSON.parse(localStorage.getItem('db_livro')) ?? [];
const setLocalStorage = (dblivro) => localStorage.setItem("db_livro", JSON.stringify(dblivro));

//CRUD

const deleteLivro = (index) => {
    const dblivro = readLivro()
    dblivro.splice(index, 1)
    setLocalStorage(dblivro)
}

const updateLivro = (index, livro) => {
    const dblivro = readLivro()
    dblivro[index] = livro
    setLocalStorage(dblivro)
}

const readLivro = () => getLocalStorage()

const createLivro = (livro) => {
    const dblivro = getLocalStorage();
    dblivro.push(livro);
    setLocalStorage(dblivro);
}

//LAYOUT
const cadastrarLivro = () => {
    const livro = {
        titulo: document.getElementById("titulo").value,
        autor: document.getElementById("autor").value,
        genero: document.getElementById("genero").value,
        edicao: document.getElementById("edicao").value,
        ano: document.getElementById("ano").value,
        numPaginas: document.getElementById("numPaginas").value,
        emprestado: document.getElementById("emprestado").value
    }

    const index = document.getElementById("titulo").dataset.index
    if (index == 'new'){
        createLivro(livro)
        updateTabela()
    }
    else {
        updateLivro(index, livro)
        updateTabela()
    }    
}

const criarLinha = (livro, index) => {
    const novaLinha = document.createElement('tr')
    novaLinha.innerHTML = `
        <td>${livro.titulo}</td>
        <td>${livro.autor}</td>
        <td>${livro.genero}</td>
        <td>${livro.edicao}</td>
        <td>${livro.ano}</td>
        <td>${livro.numPaginas}</td>
        <td>${livro.emprestado}</td>
        <td>
            <button type="button" class="btn-edit" id="edit-${index}">Editar</button>                       
            <button type="button" class="btn-delete" id="delete-${index}">Excluir</button>
        </td>
    `
    document.querySelector('#tabela>tbody').appendChild(novaLinha)   
}

const clearTabela = () => {
    const linhas = document.querySelectorAll('#tabela>tbody tr')
    linhas.forEach(linha => linha.parentNode.removeChild(linha))
}

const updateTabela = () => {
    const dblivro = readLivro()
    clearTabela()
    dblivro.forEach(criarLinha)
}

const preencherInput = (livro) => {
    document.getElementById("titulo").value = livro.titulo
    document.getElementById("autor").value = livro.autor
    document.getElementById("genero").value = livro.genero
    document.getElementById("edicao").value = livro.edicao
    document.getElementById("ano").value = livro.ano
    document.getElementById("numPaginas").value = livro.numPaginas
    document.getElementById("emprestado").value = livro.emprestado
    document.getElementById("titulo").dataset.index = livro.index
}

const editLivro = (index) => {
    const livro = readLivro()[index]
    livro.index = index
    preencherInput(livro)
}

const editDelete = (event) => {
    if (event.target.type == 'button'){
        const [action, index] = event.target.id.split('-')
        
        if(action == 'edit'){
            editLivro(index)
        }
        else{
            deleteLivro(index)
            updateTabela()
        }
    }   
}

const consultarLivro = () => {
    let consultar = document.getElementById("consultar-titulo").value;
    let db_livro, objLivro

    db_livro = JSON.parse(localStorage.getItem("db_livro"))

    db_livro.forEach((item) => {
        objLivro = item;

        if (consultar == objLivro.titulo) {
            document.getElementById("titulo-livro").innerHTML = "Título: " + objLivro.titulo;
            document.getElementById("autor-livro").innerHTML = "Autor: " + objLivro.autor;
            document.getElementById("genero-livro").innerHTML = "Gênero: " + objLivro.genero;
            document.getElementById("edicao-livro").innerHTML = "Edição: " + objLivro.edicao;
            document.getElementById("ano-livro").innerHTML = "Ano: " + objLivro.ano;
            document.getElementById("numPag-livro").innerHTML = "Nº Páginas: " + objLivro.numPaginas;
            document.getElementById("emprestado-livro").innerHTML = "Emprestado: " + objLivro.emprestado;
        }         
    })
}

const filtrarGenero = () => {    
    let objLivro, novaLinha
    let inputFiltrarGenero = document.getElementById("inputFiltrarGenero").value;   
    const linhas = document.querySelectorAll('#tabela>tbody tr td')            

    if (inputFiltrarGenero == "") {
        alert("Nenhum gênero informado")
    }
    else {
        linhas.forEach((linha) => {
            let contentLinha = (linha.textContent)
            if (inputFiltrarGenero != contentLinha){            
                linha.parentNode.remove();                       
            }
        }) 
    
        let dblivro = readLivro()
        dblivro = JSON.parse(localStorage.getItem("db_livro"))
        dblivro.forEach((item) => {
            objLivro = item;
            if (objLivro.genero == inputFiltrarGenero){
                novaLinha = document.createElement('tr')
                novaLinha.innerHTML = `
                    <td>${objLivro.titulo}</td>
                    <td>${objLivro.autor}</td>
                    <td>${objLivro.genero}</td>
                    <td>${objLivro.edicao}</td>  
                    <td>${objLivro.ano}</td>  
                    <td>${objLivro.numPaginas}</td>  
                    <td>${objLivro.emprestado}</td>  
                    <td>
                        <button type="button" class="btn-edit" disabled="disabled">Editar</button>                       
                        <button type="button" class="btn-delete" disabled="disabled">Excluir</button>
                    </td>       
                `
            document.querySelector('#tabela>tbody').appendChild(novaLinha)
            } 
        })
    }
}

updateTabela()

//EVENTOS
document.getElementById("btn-cadastrar").addEventListener("click", cadastrarLivro)
document.querySelector('#tabela>tbody').addEventListener("click", editDelete)
document.getElementById("btnFiltrarGenero").addEventListener("click", filtrarGenero)
document.getElementById("btn-ok").addEventListener("click", consultarLivro)

