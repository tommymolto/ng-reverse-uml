import { Injectable } from '@angular/core';
import { Empresa, ILibapiService } from 'csf-pwa-lib-api';
import { IClienteService } from 'csf-canais-digitais-lib-cliente';
import { Cartao } from 'csf-types';
import { ResultadoAtivacaoCartao, IConfiguracaoService } from '../../../shared';
import { IAtivacaoCartaoService } from './ativacao-cartao.service.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { InputTecladoVirtual } from 'csf-lib-teclado-virtual';

interface BodyAtivacaoCartao {
  tecladoVirtual: InputTecladoVirtual;
  fingerprintDeviceId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AtivacaoCartaoService implements IAtivacaoCartaoService {

  constructor(
    private clienteService: IClienteService,
    private configService: IConfiguracaoService,
    private apiService: ILibapiService
  ) { }

  async realizarAtivacaoCartao(inputTecladoVirtual: InputTecladoVirtual, hardwareFingerprint: string): Promise<ResultadoAtivacaoCartao> {
    let resultadoAtivacaoCartao: ResultadoAtivacaoCartao;
    const gerenciamentoCartaoUrl = this.apiService.leChaveAmbiente('CSF_WEB_URL_API_GERENCIAMENTO_CARTAO');
    const numeroConta = this.clienteService.numeroContaSelecionado;
    const url = `${gerenciamentoCartaoUrl}api/contas/${numeroConta}/ativar`;
    const body = this.gerarBodyAtivacaoCartao(inputTecladoVirtual, hardwareFingerprint);
    await this.apiService.post<string>(url, body)
      .then(_ => resultadoAtivacaoCartao = ResultadoAtivacaoCartao.Sucesso)
      .catch((error: HttpErrorResponse) => {
        switch (error.status) {
          case 405:
            resultadoAtivacaoCartao = ResultadoAtivacaoCartao.Bloqueio;
            break;

          case 400:
            resultadoAtivacaoCartao = ResultadoAtivacaoCartao.Erro;
            break;

          default:
            return Promise.reject(error);
        }
      });

    return resultadoAtivacaoCartao;
  }

  private gerarBodyAtivacaoCartao(inputTecladoVirtual: InputTecladoVirtual, fingerprintDeviceId: string): BodyAtivacaoCartao {
    return {
      tecladoVirtual: inputTecladoVirtual,
      fingerprintDeviceId
    };
  }

  get cartao(): Cartao {
    return this.clienteService.cartaoPrimario;
  }

  get empresa(): Empresa {
    return this.configService.isAppCarrefour ? Empresa.Carrefour : Empresa.Atacadao;
  }

}
