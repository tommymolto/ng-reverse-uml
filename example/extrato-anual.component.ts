  import { Component, OnInit } from "@angular/core";
  import { IExtratoAnualTarifaService } from "../../shared/services/extrato-anual-tarifa/extrato-anual-tarifa.service.interface";
  import { IClienteService } from "csf-canais-digitais-lib-cliente";

  @Component({
    selector: "lib-extrato-anual",
    templateUrl: "./extrato-anual.component.html",
    styleUrls: ["./extrato-anual.component.scss"],
  })
  export class ExtratoAnualComponent implements OnInit {
    extratoTarifas: any[] = [];
    elementLoading = true;
    errorTarifa = false;
    constructor(
      private extratoAnualService: IExtratoAnualTarifaService,
      private clienteService: IClienteService
    ) {}



    ngOnInit() {
      this.obterExtratoTarifas();
    }

    async obterExtratoTarifas() {
      this.elementLoading = true;
        const contaSelecionada = this.clienteService.numeroContaSelecionado;
      try {
        this.extratoTarifas = await this.extratoAnualService.carregarListaExtratoAnualTarifas(
          contaSelecionada
        );
      } catch (error) {
        this.errorTarifa = true;
      }
      this.elementLoading = false;
    }

    async downloadPdf(id: number) {
      const contaSelecionada = this.clienteService.numeroContaSelecionado;

      const result = await this.extratoAnualService.carregarPdfExtratoAnualTarifa(
        contaSelecionada,
        id
      );
      const linkSource = `data:application/pdf;base64,${result["faturaBase64"]}`;
      const downloadLink = document.createElement("a");
      const fileName = "extrato_anual_tarifa.pdf";

      const dt = new Date();
      dt.getDate();

      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    }
  }
