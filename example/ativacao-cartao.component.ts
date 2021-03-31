import { Component, OnDestroy, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { CsfCabecalhoService, VersaoCabecalho, Empresa, CsfSnackbarService, TipoSnackbar } from 'csf-lib-components';
import { InputTecladoVirtual } from 'csf-lib-teclado-virtual/lib/models';
import { IModaisHomeService, tipoModalHome, ResultadoAtivacaoCartao, INativeHomeService } from '../../shared';
import { Cartao } from 'csf-types';
import { IAtivacaoCartaoService } from './service/ativacao-cartao.service.interface';
import { AtivacaoCartaoService } from './service/ativacao-cartao.service';

@Component({
  selector: 'lib-ativacao-cartao',
  templateUrl: './ativacao-cartao.component.html',
  styleUrls: ['./ativacao-cartao.component.scss'],
  providers: [{ provide: IAtivacaoCartaoService, useClass: AtivacaoCartaoService }]
})
export class AtivacaoCartaoComponent implements OnInit, OnDestroy {

  mostrarLoader = false;
  valor = '';
  private temErroSenha = false;

  @ViewChild('titulo') titulo: ElementRef;
  @ViewChild('conteudo') conteudo: ElementRef;
  @ViewChild('erroPin') erroPin: ElementRef;
  @ViewChild('tecladoVirtual') tecladoVirtual: ElementRef;

  constructor(
    private service: IAtivacaoCartaoService,
    private modalService: IModaisHomeService,
    private nativeService: INativeHomeService,
    private router: Router,
    private header: CsfCabecalhoService,
    private snackbarService: CsfSnackbarService,
    private location: Location) {
    this.header.configurar({
      titulo: 'Desbloqueio do cartão',
      versao: VersaoCabecalho.Nova,
      empresa: this.empresa,
      mostrarCabecalho: true,
      mostrarBotaoVoltar: true,
      clickVoltarCallback: () => {
        this.onVoltar();
      }
    });
  }

  ngOnInit(): void {
    // this.nativeService.obterHardwareFingerprint();
  }

  ngOnDestroy(): void {
    this.modalService.resetaModal();
  }

  async senhaFoiDigitada(input: InputTecladoVirtual) {
    this.mostrarLoader = true;
    try {
      const hardwareFingerprint = await this.obterHardwareFingerprint();

      const resultado = await this.service.realizarAtivacaoCartao(input, hardwareFingerprint);
      if (resultado !== ResultadoAtivacaoCartao.Sucesso) {
        this.exibirErroAtivacaoCartao(resultado);
        return;
      }
      this.modalService.exibeModal(tipoModalHome.CartaoAtivadoSucesso);
    } catch {
      this.exibeMensagemErro();
    } finally {
      this.mostrarLoader = false;
    }
  }

  private exibirErroAtivacaoCartao(resultado: ResultadoAtivacaoCartao): void {
    switch (resultado) {
      case ResultadoAtivacaoCartao.Erro:
        this.mostraMensagemErroSenha();
        break;

      case ResultadoAtivacaoCartao.Bloqueio:
        this.modalService.exibeModal(tipoModalHome.SenhaCartaoBloqueada);
        break;

      default:
        // Erro genérico de serviço
        this.snackbarService.push({
          titulo: 'Por favor, tente novamente',
          texto: 'Ops, tivemos um erro inesperado :(',
          tipo: TipoSnackbar.Alerta
        });
        return;
    }
  }

  esqueciSenha(): void {
    this.modalService.exibeModal(tipoModalHome.EsqueciSenha);
  }

  fecharModal() {
    this.modalService.resetaModal();
  }

  continuarModal(tipo: tipoModalHome) {
    switch (tipo) {
      case 'CartaoAtivadoSucesso':
        this.router.navigate(['/home'], {
          queryParams: {
            force_account_refresh: true
          }
        });
        break;
      case 'EsqueciSenha':
        window.open('tel:1140046200', '_self');
        break;
      default:
        this.fecharModal();
        break;
    }
  }

  private exibeMensagemErro(): void {
    this.mostrarLoader = false;
    this.snackbarService.push({
      titulo: 'Por favor, tente novamente',
      texto: 'Ops, tivemos um erro inesperado :(',
      tipo: TipoSnackbar.Alerta
    });
  }

  mostraTecladoVirtual(): void {
    // Some o título
    if (this.titulo && this.titulo !== undefined) {
      const titulo = this.titulo.nativeElement;
      titulo.style.cssText = `margin-top: -${titulo.offsetHeight}px; opacity: 0`;
    }

    // Habilita o scroll
    if (this.conteudo && this.conteudo !== undefined) {
      const conteudo = this.conteudo.nativeElement;
      conteudo.style.cssText = `overflow-y: auto`;
    }

    // Exibe o teclado
    if (this.tecladoVirtual && this.tecladoVirtual !== undefined) {
      const tecladoVirtual = this.tecladoVirtual.nativeElement;
      tecladoVirtual.style.cssText = `transform: translateY(0); opacity: 1; pointer-events: initial`;
    }
  }

  private mostraMensagemErroSenha(): void {
    if (this.erroPin && this.erroPin !== undefined) {
      const erroPin = this.erroPin.nativeElement;
      erroPin.style.cssText = `height: ${erroPin.scrollHeight}px; opacity: 1; ; transform: translateY(0);`;
    }
    this.temErroSenha = true;
  }

  private ocultaMensagemErroSenha(): void {
    if (this.erroPin && this.erroPin !== undefined) {
      const erroPin = this.erroPin.nativeElement;
      erroPin.style.cssText = `height: 0px; opacity: 0; transform: translateY(-10px);`;
    }
    this.temErroSenha = false;
  }

  get temErro(): boolean {
    return this.temErroSenha;
  }

  get cartao(): Cartao {
    return this.service.cartao;
  }

  get finalCartao(): string {
    return this.cartao && this.cartao.numero.substring(this.cartao.numero.length - 4);
  }

  private async obterHardwareFingerprint(): Promise<string | null> {
    return await this.nativeService.hardwareFingerprint.toPromise();
  }

  inputAlterado(teclasDigitadas: number) {
    if (this.temErro && teclasDigitadas > 0) {
      this.ocultaMensagemErroSenha();
    }
    this.valor = ' '.repeat(teclasDigitadas);
  }

  private onVoltar() {
    this.location.back();
  }

  private get empresa(): Empresa {
    return this.service.empresa;
  }

}
