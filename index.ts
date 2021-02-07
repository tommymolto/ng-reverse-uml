import { join } from 'path';
import { WorkspaceSymbols } from 'ngast';
import * as ts from 'typescript';
const config = join(process.cwd(), 'tsconfig.json');
const workspace = new WorkspaceSymbols(config);
const modules = workspace.getAllModules();
const components = workspace.getAllComponents();
const directives = workspace.getAllDirectives();
const injectables = workspace.getAllInjectable();
const pipes = workspace.getAllPipes();
// console.log(components.rootNames);
// console.log(components.rootNames);
const file = 'C:\\Users\\tommy\\Downloads\\csf-canais-digitais-web-extrato-anual-de-tarifas\\csf-canais-digitais-web-extrato-anual-de-tarifas\\projects\\extrato-anual-tarifa\\src\\lib\\components\\extrato-anual\\extrato-anual.component.ts';
const program = ts.createProgram([file], { allowJs: true });
const sc = program.getSourceFile(file);
let indent = 0;

let usuario = 'Usuario';

let component = '';
let headers = [];
let properties = [];
let methods = [];
let componentMethods= ['ngOnInit'];
let uml = '@staruml' +
  'participant participant as Usuario';
function print(node: ts.Node) {


  console.log(new Array(indent + 1).join(' ') + ts.SyntaxKind[node.kind] + '->');
  if(ts.SyntaxKind[node.kind] === 'Constructor') {
    ts.forEachChild(node, x => {
      if (ts.SyntaxKind[x.kind] === 'Parameter') {
        const l = JSON.parse(JSON.stringify(x));
        headers.push('boundary ' + l.type.typeName.escapedText + ' as ' + l.name.escapedText);
        // console.log(l);
      }
      // console.log('=>' + new Array(indent + 1).join(' ') + ts.SyntaxKind[x.kind] + '->');
    });
  }
  if (ts.SyntaxKind[node.kind] === 'ClassDeclaration') {
    const l = JSON.parse(JSON.stringify(node));
    headers.push('actor ' +  l.name.escapedText + ' as ' +  l.name.escapedText);
    component = l.name.escapedText;
    // console.log('classe=', l);

  }
  if (ts.SyntaxKind[node.kind] === 'PropertyDeclaration') {
    // Somente em atividades
  }
  if (ts.SyntaxKind[node.kind] === 'MethodDeclaration') {
    const l = JSON.parse(JSON.stringify(node));

    // console.log('conteudo', l);
    const xx: ts.MethodDeclaration = node as ts.MethodDeclaration;
    // console.log('method', xx.body);
    const p = l.name.escapedText;
    if (componentMethods.includes(p)) {
      methods.push(component + '->' + component + ' : ' + p);
      verificaChamadas(node, xx);
      methods.push(component + '<-' + component + ' : ' + p);
    }

  }
  if (ts.SyntaxKind[node.kind] === 'ThisDeclaration' || ts.SyntaxKind[node.kind] === 'PropertyAccessExpression') {
      // console.log('Olha o this', node)
  }
  indent++;
  ts.forEachChild(node, print);
  indent--;
}
function verificaChamadas(no: ts.Node, metodo: ts.MethodDeclaration) {
    var xxx = metodo.name as ts.Identifier;
    console.log('filhos de ', xxx.escapedText   );
  ts.forEachChild(no, x => {
    if (ts.SyntaxKind[x.kind] === 'PropertyAccessExpression') {
      const hh : PropertyDescriptor = x as PropertyDescriptor;

      // console.log('chamu ' + metodo, JSON.parse(JSON.stringify(no)));
    }
    verificaChamadas(x, metodo);
  });


}
ts.forEachChild(sc, x => {
  // console.log(x);
  print(x);

})
console.log('headers', headers);
console.log('methods', methods);


