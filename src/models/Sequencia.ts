export default interface Sequencia{
    metodo: string;
    componente?: string;
    ordem?: number;
    chamadas?: Sequencia[];
}
/*
[
    {
        componente: ExtratoAnualComponent,
        metodo:constructor,
        chamadas:[
            {
                componente:ExtratoAnualComponent,
                metodo: ngOnInit,
                ordem: 0
            }
        ]
    },
    {
        nome:ngOnInit,
        componente: ExtratoAnualComponent,
        chamadas: [
            {
                    nome:ExtratoAnualComponent,
                    metodo: ngOnInit,
                    ordem: 0
            }
        ]
    }

]

participant participant as Usuario
actor ExtratoAnualComponent as ExtratoAnualComponent
boundary IExtratoAnualTarifaService as extratoAnualService
boundary IClienteService as clienteService
ExtratoAnualComponent->ExtratoAnualComponent #005500 : ngOnInit
ExtratoAnualComponent->ExtratoAnualComponent #0055FF :obterExtratoTarifas
ExtratoAnualComponent  -> clienteService #0055F0: numeroContaSelecionado
ExtratoAnualComponent -> extratoAnualService: carregarListaExtratoAnualTarifas
deactivate ExtratoAnualComponent
Usuario -> ExtratoAnualComponent  #00FF00: downloadPdf
ExtratoAnualComponent  -> clienteService  #0055F0: numeroContaSelecionado
ExtratoAnualComponent -> extratoAnualService : carregarPdfExtratoAnualTarifa
 */
