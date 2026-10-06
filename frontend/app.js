// Json-server local: http://localhost:3000
// API real local:    http://localhost:3001
// Na Parte 5 troca pelo URL da API no Render
const API_URL = "https://api-alunos-9t5n.onrender.com";

const tabela = document.getElementById("tabela");
const form = document.getElementById("form-aluno");
const selectCurso = document.getElementById("idCurso");
const btnGuardar = document.getElementById("btn-guardar");
const btnCancelar = document.getElementById("btn-cancelar");
const msg = document.getElementById("msg");

let cursos = [];

async function pedido(url, opcoes) {
  const res = await fetch(`${API_URL}${url}`, opcoes);
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.status === 204 ? null : res.json();
}

async function carregarCursos() {
  cursos = await pedido("/cursos");
  selectCurso.innerHTML = cursos
    .map(c => `<option value="${c.id}">${c.nomeDoCurso}</option>`)
    .join("");
}

async function carregarAlunos() {
  try {
    const alunos = await pedido("/alunos");
    tabela.innerHTML = alunos.map(a => {
      const curso = cursos.find(c => String(c.id) === String(a.idCurso));
      return `<tr>
        <td>${a.nome}</td><td>${a.apelido}</td>
        <td>${curso ? curso.nomeDoCurso : "-"}</td><td>${a.anoCurricular}</td>
        <td>
          <button class="editar" onclick="editar('${a.id}')">Editar</button>
          <button class="apagar" onclick="apagar('${a.id}')">Apagar</button>
        </td></tr>`;
    }).join("");
    msg.textContent = "";
  } catch (e) {
    msg.textContent = "Não foi possível carregar os alunos: " + e.message;
  }
}

async function apagar(id) {
  if (!confirm("Apagar este aluno?")) return;
  try {
    await pedido(`/alunos/${id}`, { method: "DELETE" });
    carregarAlunos();
  } catch (e) { msg.textContent = e.message; }
}

async function editar(id) {
  const a = await pedido(`/alunos/${id}`);
  document.getElementById("id").value = a.id;
  document.getElementById("nome").value = a.nome;
  document.getElementById("apelido").value = a.apelido;
  selectCurso.value = a.idCurso;
  document.getElementById("anoCurricular").value = a.anoCurricular;
  btnGuardar.textContent = "Guardar alterações";
  btnCancelar.hidden = false;
}

function limparForm() {
  form.reset();
  document.getElementById("id").value = "";
  btnGuardar.textContent = "Adicionar";
  btnCancelar.hidden = true;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("id").value;
  const valorCurso = selectCurso.value;
  const aluno = {
    nome: document.getElementById("nome").value,
    apelido: document.getElementById("apelido").value,
    // json-server usa ids numéricos; o MongoDB usa ids em texto
    idCurso: /^\d+$/.test(valorCurso) ? Number(valorCurso) : valorCurso,
    anoCurricular: Number(document.getElementById("anoCurricular").value),
  };
  try {
    await pedido(id ? `/alunos/${id}` : "/alunos", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aluno),
    });
    limparForm();
    carregarAlunos();
  } catch (err) { msg.textContent = err.message; }
});

btnCancelar.addEventListener("click", limparForm);

(async () => {
  try {
    await carregarCursos();
    await carregarAlunos();
  } catch (e) {
    msg.textContent = "Não foi possível ligar à API: " + e.message;
  }
})();
