# Bem-vindo ao Synura!

## O que é Synura?
Synura é um aplicativo versátil que permite navegar por conteúdo de várias fontes usando mini-aplicativos poderosos chamados "extensões". Pense nisso como um navegador, mas em vez de sites, você usa extensões para obter conteúdo em um formato de aplicativo nativo e limpo.

## Conceitos Chave para Usuários

*   **Descoberta de Extensões**: Insira um domínio (por exemplo, `example.com` ou `https://example.com`) para buscar automaticamente o arquivo `synura.js` desse domínio. Se nenhum protocolo for fornecido, `https://` é usado por padrão. Esta é a principal maneira de instalar extensões de seus sites oficiais.
*   **Instalação Direta**: Insira uma URL completa (por exemplo, `https://raw.githubusercontent.com/user/repo/main/synura.js`) para instalar um script de extensão específico. **Nota de Segurança**: Este método é restrito a domínios confiáveis (como GitHub, GitLab, etc.) para evitar a execução de código malicioso. Não use isso para domínios gerais.
*   **Validação de Lista Branca**: Instalações diretas por URL são validadas contra uma lista branca de domínios permitidos por segurança. A descoberta de domínio ignora essa verificação para permitir a exploração.
*   **Extensões**: Estes são pequenos plugins que buscam e exibem conteúdo. Por exemplo, você pode ter uma extensão para um site de notícias, uma plataforma de vídeo ou um feed de mídia social. Você pode instalar novas extensões para expandir o que pode fazer com o Synura.
*   **Runtimes (Ambientes de Execução)**: Quando você abre uma extensão, ela é executada em um "runtime". Você pode ter vários runtimes abertos ao mesmo tempo, assim como ter várias abas em um navegador web. Cada runtime é uma instância separada de uma extensão. Você pode alternar entre eles e até mesmo ter vários runtimes para a mesma extensão.
*   **Favoritos**: Encontrou algo interessante? Você pode adicionar a visualização atual aos favoritos para salvá-la para mais tarde. Um favorito salva o estado exato da visualização, para que você possa voltar a ela a qualquer momento.

## Navegando pelo Aplicativo

### A Tela Principal
A tela principal do aplicativo é onde você gerencia seus runtimes. A barra superior (barra de aplicativos) é sua principal ferramenta de navegação.

### A Barra de Aplicativos

A barra de aplicativos possui vários ícones que ajudam você a navegar e gerenciar seu conteúdo. Alguns ícones têm **atalhos ocultos** acessados por um toque longo:

*   **`+` (Adicionar)**:
    *   **Toque**: Abrir um novo runtime. Você pode escolher uma extensão instalada ou inserir um domínio/URL de site para instalar uma nova.
    *   **Toque Longo**: Abrir a tela de **Gerenciamento de Extensões** para ver detalhes sobre suas extensões instaladas.
*   **Menu Suspenso (centro)**: Exibe o runtime atualmente ativo. Toque para alternar entre runtimes abertos ou deslize para a esquerda/direita no menu suspenso para percorrê-los.
*   **`X` (Fechar)**: Fecha o runtime atual.
*   **`↻` (Atualizar)**: *Visível apenas no Modo Desenvolvedor.* Atualiza a extensão atual de sua fonte.
*   **`✨` (IA)**:
    *   **Toque**: Abrir o **Menu de IA** para ações rápidas (Resumir, Traduzir, etc.).
    *   **Toque Longo**: Abrir **Configurações de IA** para configurar provedores e preferências.
*   **`☆` (Adicionar Favorito)**:
    *   **Toque**: Salvar a visualização atual em seus favoritos.
    *   **Toque Longo**: Ir diretamente para sua lista de **Favoritos**.
*   **`🔖` (Favoritos)**: Ver sua lista de favoritos salvos.
*   **`⚙️` (Configurações)**: Abrir a tela principal de configurações.

Se a tela for muito estreita, algumas opções podem se mover para um menu de três pontos.

### Botão de IA (`✨`)
Toque no **botão de IA** na barra de aplicativos para abrir a **Caixa de Diálogo do Menu de IA**. Isso oferece recursos baseados em IA sob demanda para a visualização atual:

*   **Resumo**: Obtenha um resumo rápido gerado por IA do conteúdo na tela.
*   **Traduzir**: Traduza o conteúdo para seu idioma de destino (configurado nas Configurações de IA).
*   **Prompt Personalizado**: Insira suas próprias instruções para a IA analisar o conteúdo.
*   **Compartilhar com IA Externa**: Exporte o conteúdo da visualização atual para aplicativos de IA externos como ChatGPT ou Gemini em seu dispositivo.
*   **Alternar Cache**: Controle se deve usar resultados de IA em cache ou forçar uma nova análise.

Para configuração detalhada de IA, vá para **Configurações > Configurações de IA** onde você pode:
*   Configurar seu provedor de IA preferido (Gemini, OpenAI, DeepSeek, Claude).
*   Definir idiomas de origem e destino para tradução.
*   Escolher o intervalo de pesquisa de análise (Profundo é apenas na Visualização de Lista) e perfil (Resumo, Explicar, Simplificar, Verificação de Fatos, Crítica, Insight).
*   Ajustar as preferências de comprimento do resumo.
*   Ver estatísticas de uso de tokens.
*   Gerenciar chaves de API para cada provedor.

### Favoritos
A tela de favoritos mostra todas as suas visualizações salvas.

*   **Instantâneo de Visualização**: Tocar em um favorito abre um **instantâneo em cache** da página como ela estava quando você a salvou. Isso é ótimo para consultar informações rapidamente sem precisar de uma conexão com a internet.
*   **Restaurar Visualização**: Para interagir com a página novamente (por exemplo, clicar em links, atualizar dados), procure o **ícone de restauração**. Tocar nisso reconectará à extensão e trará a visualização de volta à vida em um novo runtime.

## Configurações (`⚙️`)

A tela de configurações permite ajustar quase todos os aspectos de sua experiência no Synura.

### Extensões
*   **Instalar Novas Extensões**: Toque no botão **`+`** na barra de aplicativos e insira o domínio do site (por exemplo, `https://example.com`). Se o site suportar Synura, a extensão será automaticamente descoberta e instalada.
*   **Gerenciar Extensões**: Toque em **Gerenciar** para ver uma lista de suas extensões instaladas, onde você pode atualizá-las ou removê-las.

### Aparência
*   **Ajustar Densidade de Conteúdo**: Use o controle deslizante para fazer o conteúdo parecer mais espaçado ou mais compacto. Você verá uma prévia ao vivo de como isso afeta listas e cartões.
*   **Tema de Cor**: Personalize a aparência do aplicativo escolhendo entre esquemas de cores **Claro**, **Escuro** e **Monokai**.
*   **Peso da Fonte**: Ajuste a espessura do texto de acordo com sua preferência (por exemplo, leve, regular, negrito).
*   **Idioma**: Definir o idioma do aplicativo. Você pode escolher um idioma específico ou deixá-lo seguir o padrão do seu sistema.

### Comportamento
*   **Tempo Limite de Rede**: Defina quanto tempo o aplicativo deve esperar por uma resposta de uma solicitação de rede, de 1 a 60 segundos.
*   **Configurações de Proxy**: Configure um servidor proxy para solicitações de rede.
*   **Configurações de Cache**: Gerencie o cache do aplicativo, incluindo a limpeza de dados em cache para liberar espaço.
*   **Animação GIF**: Controle como os GIFs animados são reproduzidos: **Desligado** (imagem estática), **Uma vez** (reproduzir uma vez) ou **Loop** (reproduzir continuamente).

### Vídeo e Áudio
*   **Reprodução Automática de Vídeo**: Um interruptor para controlar se os vídeos começam a ser reproduzidos automaticamente quando aparecem na tela.
*   **Reprodução de Vídeo em Segundo Plano**: Habilite isso para continuar ouvindo o áudio de um vídeo mesmo depois de navegar para longe ou alternar para outro aplicativo.
*   **Misturar com Outros**: Permitir que o áudio do Synura seja reproduzido ao mesmo tempo que o áudio de outros aplicativos.
*   **Horas de DVR de Reprodução ao Vivo**: Para transmissões ao vivo, escolha quantas horas da transmissão manter disponíveis para retroceder (de 0 a 6 horas).

### Privacidade e Segurança
*   **Gerenciar Configurações**: Configure várias opções de privacidade e segurança para controlar quais dados são armazenados e compartilhados.

### Sobre
*   **Licenças de Código Aberto**: Veja as licenças do software de código aberto que ajuda a impulsionar o Synura.

---
*Este documento é para usuários finais. Para documentação de desenvolvedores, consulte [Começando](getting_started.md), a [Referência de API](api_reference.md) e [Exemplos](examples.md).*