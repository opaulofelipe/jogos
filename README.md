# GitHub Pages Hub

Hub visual de projetos publicado com HTML, CSS e JavaScript puro.

## Como adicionar um novo projeto

Você só precisa editar o arquivo:

`data/projects.json`

Copie um objeto existente e altere os campos:

```json
{
  "nome": "Nome do projeto",
  "descricao": "Descrição curta.",
  "categoria": "Ferramentas",
  "imagem": "assets/covers/minha-capa.webp",
  "site": "https://opaulofelipe.github.io/repositorio/",
  "github": "https://github.com/opaulofelipe/repositorio",
  "tecnologias": ["JavaScript", "HTML", "CSS"],
  "status": "Publicado",
  "ano": 2026,
  "destaque": false
}
```

## Capas

As capas podem ser colocadas em:

`assets/covers/`

Recomenda-se proporção 16:9. Se o campo `imagem` ficar vazio, o site cria automaticamente um fallback visual para o card.

## Categorias

Não é necessário editar o HTML para criar uma nova categoria. As categorias são lidas automaticamente do `projects.json`.

## Destaques

Para colocar um projeto na seção de destaques:

```json
"destaque": true
```

O site mostra até três destaques no topo.

## Publicação

O projeto funciona diretamente no GitHub Pages, sem framework, banco de dados ou etapa de build.
