# Bem-vindo ao Synura!

## O que é Synura?
Synura é uma aplicação versátil que permite navegar por conteúdo de várias fontes usando poderosos mini-aplicativos chamados "extensões". Pense nisso como um navegador, mas em vez de sites, você usa extensões para obter conteúdo em um formato de aplicativo nativo e limpo.

## Conceitos Principais para Usuários

*   **Descoberta de Extensões**: Insira um domínio (por exemplo, `example.com` ou `https://example.com`) para buscar automaticamente o arquivo `synura.js` desse domínio. Se nenhum protocolo for fornecido, `https://` é usado por padrão. Esta é a maneira principal de instalar extensões de seus sites oficiais.
*   **Instalação Direta**: Insira uma URL completa (por exemplo, `https://raw.githubusercontent.com/user/repo/main/synura.js`) para instalar um script de extensão específico. **Nota de Segurança**: Este método é restrito a domínios confiáveis (como GitHub, GitLab, etc.) para evitar a execução de código malicioso. Não use isso para domínios gerais.
*   **Validação de Lista Branca**: Instalações diretas por URL são validadas contra uma lista branca de domínios permitidos por segurança. A descoberta de domínios ignora essa verificação para permitir a exploração.
*   **Extensões**: São pequenos plugins que buscam e exibem conteúdo. Por exemplo, você pode ter uma extensão para um site de notícias, uma plataforma de vídeo ou um feed de mídia social. Você pode instalar novas extensões para expandir o que pode fazer com o Synura.
*   **Runtimes (Ambientes de Execução)**: Quando você abre uma extensão, ela é executada em um "runtime". Você pode ter vários runtimes abertos ao mesmo tempo, assim como ter várias abas em um navegador da web. Cada runtime é uma instância separada de uma extensão. Você pode alternar entre eles e até mesmo ter vários runtimes para a mesma extensão.
*   **Favoritos**: Encontrou algo interessante? Você pode adicionar a visualização atual aos favoritos para salvá-la para mais tarde. Um favorito salva o estado exato da visualização, para que você possa voltar a ela a qualquer momento.

## Navegando pelo Aplicativo

### A Tela Principal
A tela principal do aplicativo é onde você gerencia seus runtimes. A barra superior (barra do aplicativo) é sua principal ferramenta de navegação.

### A Barra do Aplicativo

A barra do aplicativo possui vários ícones:

*   **`+` (Adicionar)**: Toque aqui para abrir um novo runtime. Você pode escolher uma extensão instalada ou inserir um domínio de site para instalar uma nova.
*   **Menu Suspenso (centro)**: Mostra o runtime atualmente ativo. Toque nele para ver uma lista de todos os seus runtimes abertos e alternar entre eles. Você também pode deslizar para a esquerda ou direita no menu suspenso para alternar rapidamente.
*   **`X` (Fechar)**: Fecha o runtime atual.
*   **`☆` (Adicionar Favorito)**: Toque aqui para salvar a visualização atual em seus favoritos.
*   **`🔖` (Favoritos)**: Leva você à sua lista de favoritos salvos.
*   **`⚙️` (Configurações)**: Abre a tela de configurações, onde você pode personalizar o Synura.

Se a tela for muito estreita, essas opções serão recolhidas em um menu de três pontos à direita.

### Favoritos
A tela de favoritos mostra todas as suas visualizações salvas.

*   **Instantâneo da Visualização**: Tocar em um favorito abre um **instantâneo em cache** da página como estava quando você a salvou. Isso é ótimo para consultar informações rapidamente sem precisar de uma conexão com a internet.
*   **Restaurar Visualização**: Para interagir com a página novamente (por exemplo, clicar em links, atualizar dados), procure o **ícone de restauração**. Tocar nele reconectará à extensão e trará a visualização de volta à vida em um novo runtime.

## Configurações (`⚙️`)

A tela de configurações permite ajustar quase todos os aspectos da sua experiência no Synura.

### Extensões
*   **Instalar Novas Extensões**: Toque no botão **`+`** na barra do aplicativo e insira o domínio do site (por exemplo, `https://example.com`). Se o site suportar Synura, a extensão será descoberta e instalada automaticamente.
*   **Gerenciar Extensões**: Toque em **Gerenciar** para ver uma lista de suas extensões instaladas, onde você pode atualizá-las ou removê-las.

### Aparência
*   **Ajustar Densidade de Conteúdo**: Use o controle deslizante para fazer o conteúdo parecer mais espaçado ou mais compacto. Você verá uma prévia ao vivo de como isso afeta listas e cartões.
*   **Tema de Cor**: Personalize a aparência do aplicativo escolhendo entre os esquemas de cores **Claro**, **Escuro** e **Monokai**.
*   **Peso da Fonte**: Ajuste a espessura do texto de acordo com sua preferência (por exemplo, leve, regular, negrito).
*   **Idioma**: Defina o idioma do aplicativo. Você pode escolher um idioma específico ou deixá-lo seguir o padrão do seu sistema.

### Comportamento
*   **Tempo Limite de Rede**: Defina quanto tempo o aplicativo deve esperar por uma resposta de uma solicitação de rede, de 1 a 60 segundos.
*   **Configurações de Proxy**: Configure um servidor proxy para solicitações de rede.
*   **Configurações de Cache**: Gerencie o cache do aplicativo, incluindo a limpeza de dados em cache para liberar espaço.
*   **Animação GIF**: Controle como os GIFs animados são reproduzidos: **Desligado** (imagem estática), **Uma vez** (reproduzir uma vez) ou **Loop** (reproduzir continuamente).

### Vídeo e Áudio
*   **Reprodução Automática de Vídeo**: Um interruptor para controlar se os vídeos começam a ser reproduzidos automaticamente quando aparecem na tela.
*   **Reprodução de Vídeo em Segundo Plano**: Ative isso para continuar ouvindo o áudio de um vídeo mesmo depois de navegar para outro lugar ou alternar para outro aplicativo.
*   **Misturar com Outros**: Permita que o áudio do Synura seja reproduzido ao mesmo tempo que o áudio de outros aplicativos.
*   **Horas de DVR de Reprodução ao Vivo**: Para transmissões ao vivo, escolha quantas horas da transmissão manter disponíveis para retroceder (de 0 a 6 horas).

### Privacidade e Segurança
*   **Gerenciar Configurações**: Configure várias opções de privacidade e segurança para controlar quais dados são armazenados e compartilhados.

### Sobre
*   **Licenças de Código Aberto**: Veja as licenças do software de código aberto que ajuda a impulsionar o Synura.

---
*Este documento é para usuários finais. Para documentação de desenvolvedor, consulte [Introdução](getting_started.md), a [Referência da API](api_reference.md) e [Exemplos](examples.md).*