// Recuperar dados salvos
let obras = JSON.parse(localStorage.getItem("obras")) || [];

function salvarDados() {
  localStorage.setItem("obras", JSON.stringify(obras));
}

function adicionarObra() {
  const nome = document.getElementById("obraNome").value.trim();
  if (!nome) return alert("Digite o nome da obra!");

  obras.push({ nome, materiais: [] });
  salvarDados();
  renderObras();
  document.getElementById("obraNome").value = "";
}

function adicionarMaterial(obraIndex) {
  const material = prompt("Nome do material:").toLowerCase();
  let necessario = parseInt(prompt("Quantidade necessária:"), 10);
  let emObra = parseInt(prompt("Quantidade disponível na obra:"), 10);

  if (!material || isNaN(necessario) || isNaN(emObra)) return;

  // Conversão para areia/brita (1 carga = 13 m³)
  if (material === "areia" || material === "brita") {
    necessario = necessario * 13;
    emObra = emObra * 13;
    alert(`Medidas convertidas automaticamente para m³ (1 carga = 13m³).`);
  }

  obras[obraIndex].materiais.push({ material, necessario, emObra });
  salvarDados();
  renderObras();
}

function renderObras() {
  const container = document.getElementById("obrasContainer");
  container.innerHTML = "";

  let resumoFaltando = {};
  let resumoSobrando = {};

  obras.forEach((obra, index) => {
    const div = document.createElement("div");
    div.className = "obra";

    let html = `<h3>${obra.nome}</h3>`;
    html += `<table>
      <tr>
        <th>Material</th>
        <th>Necessário</th>
        <th>Em Obra</th>
        <th>Faltando</th>
        <th>Sobrando</th>
      </tr>`;

    obra.materiais.forEach(mat => {
      let diferenca = mat.necessario - mat.emObra;
      let faltando = diferenca > 0 ? diferenca : 0;
      let sobrando = diferenca < 0 ? Math.abs(diferenca) : 0;

      // Atualiza resumos
      if (faltando > 0) {
        if (!resumoFaltando[mat.material]) resumoFaltando[mat.material] = 0;
        resumoFaltando[mat.material] += faltando;
      }
      if (sobrando > 0) {
        if (!resumoSobrando[mat.material]) resumoSobrando[mat.material] = 0;
        resumoSobrando[mat.material] += sobrando;
      }

      html += `
        <tr>
          <td>${mat.material}</td>
          <td>${mat.necessario}</td>
          <td>${mat.emObra}</td>
          <td style="color:red">${faltando}</td>
          <td style="color:green">${sobrando}</td>
        </tr>`;
    });

    html += `</table>
      <button class="small" onclick="adicionarMaterial(${index})">+ Material</button>
    `;

    div.innerHTML = html;
    container.appendChild(div);
  });

  // Atualiza resumo
  const resumoUl = document.getElementById("resumoMateriais");
  resumoUl.innerHTML = "<h3>Faltando:</h3>";
  for (let mat in resumoFaltando) {
    const li = document.createElement("li");
    li.textContent = `${mat}: ${resumoFaltando[mat]} unidades/m³ faltando`;
    resumoUl.appendChild(li);
  }

  resumoUl.innerHTML += "<h3 style='margin-top:10px;'>Sobrando:</h3>";
  for (let mat in resumoSobrando) {
    const li = document.createElement("li");
    li.textContent = `${mat}: ${resumoSobrando[mat]} unidades/m³ sobrando`;
    resumoUl.appendChild(li);
  }
}

renderObras();
