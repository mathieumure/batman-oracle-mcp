---
theme: default
title: Batman Oracle MCP
mdc: true
colorSchema: light
monaco: true
twoslash: true
lineNumbers: true
layout: splash-screen
---

---

layout: title
align: left
note: 'Variante: align: left'

---

::number::
02

::default::
Coucou Double M à gauche

::subtitle::
Variante du layout "title" avec align: left

---

layout: numbers
columns: 3
note: 'layout: numbers — props: columns · slots: title, item-1..6 (avec <span class="item-number">)'

---

::title::
Numbers

::item-1::
<span class="item-number">01</span>

### Première section

Description courte de la section

::item-2::
<span class="item-number">02</span>

### Deuxième section

Description courte de la section

::item-3::
<span class="item-number">03</span>

### Troisième section

Description courte de la section

---

layout: content
columns: 2
note: 'layout: content — props: columns (1 ou 2) · slots: title, default, col-2'

---

::title::
Deux colonnes

::default::
Voici le texte de la première colonne, avec plusieurs lignes pour tester le rendu et la longueur des paragraphes.

::col-2::
Et voici la deuxième colonne, utile pour comparer deux idées côte à côte.

---

layout: content
columns: 1
note: 'Variante: columns: 1'

---

::title::
Une seule colonne

::default::
Quand on n'a pas besoin de comparer deux idées, une seule colonne suffit et le texte prend toute la largeur disponible. Variante du layout "content" avec columns: 1.

---

layout: grid
columns: 2
note: 'layout: grid — props: columns · slots: title, item-1..6'

---

::title::
Une grille 2x2

::item-1::

### Élément A

Description de l'élément A

::item-2::

### Élément B

Description de l'élément B

::item-3::

### Élément C

Description de l'élément C

::item-4::

### Élément D

Description de l'élément D

---

layout: mockup
side: right
note: "layout: mockup — props: side (right/left) · slots: title, default,
content (libre: texte, image, code...)"

---

::title::
Contenu à droite

::default::
Le layout "mockup" ne présume plus d'un "écran" — le slot content accepte n'importe quoi : texte, image, bloc de code...

::content::
<MacWindow title="villain.ts" height="140px">

```ts
const villain = 'Joker';
console.log(`Watch out for ${villain}`);
```

</MacWindow>

---

layout: mockup
side: left
note: "Variante: side: left — ici avec un <ImagePlaceholder> dans le slot content"

---

::title::
Contenu à gauche

::default::
Même layout "mockup", avec la prop side: left — le texte passe à droite, le contenu libre à gauche.

::content::
<ImagePlaceholder label="Photo du Batmobile" />

---

layout: content
columns: 1
note: 'composant <MacWindow> (components/MacWindow.vue) — utilisable sur toutes
les slides · props: title, height, label'

---

::title::
Un bloc de code stylé

::default::
<MacWindow title="batcave.ts" label="TypeScript" height="320px">

```ts
interface Gadget {
  name: string;
  durability: number;
}

class BatCave {
  private gadgets: Gadget[] = [];

  stock(gadget: Gadget) {
    this.gadgets.push(gadget);
    console.log(`Stocked ${gadget.name}`);
  }

  findByName(name: string): Gadget | undefined {
    return this.gadgets.find((g) => g.name === name);
  }

  get inventoryCount() {
    return this.gadgets.length;
  }
}

const cave = new BatCave();
cave.stock({ name: 'Batarang', durability: 92 });
cave.stock({ name: 'Grapnel Gun', durability: 78 });

console.log(`Gadgets ready: ${cave.inventoryCount}`);
```

</MacWindow>

---

layout: blank
background: /assets/images/bg-cave-drip.svg
note: 'code block: Monaco natif — {monaco} rend le bloc éditable en mémoire (non persisté)'

---

::default::

<div class="h-full flex items-center justify-center p-12">
<MacWindow title="playground.ts" label="Monaco — éditable" height="420px" style="width: 100%">

```ts {monaco}
function greet(name: string) {
  return `Hello, ${name}!`;
}

console.log(greet('Batman'));
```

</MacWindow>
</div>

---

layout: blank
background: /assets/images/background.svg
note: 'code block: twoslash — hover sur les types, erreurs inline via // @errors: <code>'

---

::default::

<div class="h-full flex items-center justify-center p-12">
<MacWindow title="greet.ts" label="TwoSlash" height="420px" style="width: 100%">

```ts twoslash
// @errors: 2345
function greet(name: string) {
  return `Hello, ${name}!`;
}

greet(42);
Untrucaupif;
```

</MacWindow>
</div>

---

layout: blank
background: /assets/images/bg-cave-canyon.svg
note: 'code block: <<< fichier {monaco-write} — édition liée à un vrai fichier sur disque, sauvegardée directement'

---

::default::

<div class="h-full flex items-center justify-center p-12">
<MacWindow title="editable-example.ts" label="monaco-write" height="420px" style="width: 100%">

<<< ./components/demo/editable-example.ts {monaco-write}

</MacWindow>
</div>

---

layout: team
columns: 2
note: 'layout: team — props: columns · slots: title, person-1..6 (avec <img> ou placeholder)'

---

::title::
L'équipe

::person-1::

### Mathieu Mure

Rôle ou description courte

::person-2::

### Mickaël Alves

Rôle ou description courte

---

layout: blank
background: /assets/images/background.svg
note: 'layout: blank — prop: background (vide par défaut) · slot libre (default)'

---

<div class="h-full flex items-center justify-center text-center">
  <div>
    <h1 class="text-4xl font-bold" style="color: var(--text-primary)">Slide neutre</h1>
    <p class="mt-4" style="color: var(--text-secondary)">Layout "blank" — aucune structure imposée, le fond est ici ajouté manuellement pour la démo (background: /assets/images/background.svg).</p>
  </div>
</div>

---

layout: blank
note: "composant <Decoration> (components/Decoration.vue) — seule prop: name
(bat-01..bat-08) + style/class"

---

::default::

<div class="h-full flex flex-col items-center justify-center gap-10">
  <h1 class="text-4xl font-bold" style="color: var(--text-primary)">Décorations disponibles</h1>
  <div class="grid grid-cols-4 gap-10">
    <div class="flex flex-col items-center gap-2">
      <img src="/assets/images/bats/bat-01.svg" style="height: 110px" />
      <span style="color: var(--text-secondary)">bat-01</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <img src="/assets/images/bats/bat-02.svg" style="height: 110px" />
      <span style="color: var(--text-secondary)">bat-02</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <img src="/assets/images/bats/bat-03.svg" style="height: 110px" />
      <span style="color: var(--text-secondary)">bat-03</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <img src="/assets/images/bats/bat-04.svg" style="height: 110px" />
      <span style="color: var(--text-secondary)">bat-04</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <img src="/assets/images/bats/bat-05.svg" style="height: 110px" />
      <span style="color: var(--text-secondary)">bat-05</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <img src="/assets/images/bats/bat-06.svg" style="height: 110px" />
      <span style="color: var(--text-secondary)">bat-06</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <img src="/assets/images/bats/bat-07.svg" style="height: 110px" />
      <span style="color: var(--text-secondary)">bat-07</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <img src="/assets/images/bats/bat-08.svg" style="height: 110px" />
      <span style="color: var(--text-secondary)">bat-08</span>
    </div>
  </div>
  <p style="color: var(--text-secondary)" class="text-sm">Usage: &lt;Decoration name="bat-03" style="width:140px; top:2rem; right:3rem; transform:rotate(-10deg)" /&gt;</p>
</div>

---

layout: blank
note: palette définie dans style.css (:root)

---

::default::

<div class="h-full flex flex-col items-center justify-center gap-10">
  <h1 class="text-4xl font-bold" style="color: var(--text-primary)">Palette de couleurs</h1>
  <div class="grid grid-cols-5 gap-8">
    <div class="flex flex-col items-center gap-3">
      <div style="width: 100px; height: 100px; border-radius: 12px; background: var(--color-yellow); border: 1px solid rgba(255,255,255,0.15)"></div>
      <span style="color: var(--text-primary)" class="font-bold text-sm">--color-yellow</span>
      <span style="color: var(--text-secondary)" class="text-xs">#fdff00</span>
    </div>
    <div class="flex flex-col items-center gap-3">
      <div style="width: 100px; height: 100px; border-radius: 12px; background: var(--color-gold)"></div>
      <span style="color: var(--text-primary)" class="font-bold text-sm">--color-gold</span>
      <span style="color: var(--text-secondary)" class="text-xs">#988829</span>
    </div>
    <div class="flex flex-col items-center gap-3">
      <div style="width: 100px; height: 100px; border-radius: 12px; background: var(--color-black); border: 1px solid rgba(255,255,255,0.15)"></div>
      <span style="color: var(--text-primary)" class="font-bold text-sm">--color-black</span>
      <span style="color: var(--text-secondary)" class="text-xs">#242424</span>
    </div>
    <div class="flex flex-col items-center gap-3">
      <div style="width: 100px; height: 100px; border-radius: 12px; background: var(--color-navy); border: 1px solid rgba(255,255,255,0.15)"></div>
      <span style="color: var(--text-primary)" class="font-bold text-sm">--color-navy</span>
      <span style="color: var(--text-secondary)" class="text-xs">#282e3c</span>
    </div>
    <div class="flex flex-col items-center gap-3">
      <div style="width: 100px; height: 100px; border-radius: 12px; background: var(--color-slate)"></div>
      <span style="color: var(--text-primary)" class="font-bold text-sm">--color-slate</span>
      <span style="color: var(--text-secondary)" class="text-xs">#505c7c</span>
    </div>
    <div class="flex flex-col items-center gap-3">
      <div style="width: 100px; height: 100px; border-radius: 12px; background: var(--text-primary); border: 1px solid rgba(255,255,255,0.15)"></div>
      <span style="color: var(--text-primary)" class="font-bold text-sm">--text-primary</span>
      <span style="color: var(--text-secondary)" class="text-xs">#f5f5f4</span>
    </div>
    <div class="flex flex-col items-center gap-3">
      <div style="width: 100px; height: 100px; border-radius: 12px; background: var(--text-secondary)"></div>
      <span style="color: var(--text-primary)" class="font-bold text-sm">--text-secondary</span>
      <span style="color: var(--text-secondary)" class="text-xs">#b9c0cf</span>
    </div>
  </div>
</div>

---

layout: thanks
note: 'layout: thanks — slots: default, question, contact'

---

::default::
Merci !

::question::
Des questions ?

::contact::
email@example.com

@handle
