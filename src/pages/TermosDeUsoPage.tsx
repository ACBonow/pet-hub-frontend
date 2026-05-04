import { Link } from 'react-router-dom'
import PublicLayout from '@/shared/components/layout/PublicLayout'
import LogoMark from '@/shared/components/ui/LogoMark'
import { ROUTES } from '@/routes/routes.config'

const CONTACT_EMAIL = 'tchepethub@gmail.com'

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-ink border-b border-line pb-2">{title}</h2>
      <div className="flex flex-col gap-2 text-sm text-body leading-relaxed">{children}</div>
    </section>
  )
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 mt-1">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <div className="flex flex-col gap-1 text-sm text-body leading-relaxed">{children}</div>
    </div>
  )
}

export default function TermosDeUsoPage() {
  return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto px-4 lg:px-8 py-10">
        <div className="flex flex-col items-center gap-2 mb-8">
          <Link to={ROUTES.HOME}>
            <LogoMark size={28} />
          </Link>
          <h1 className="text-2xl font-extrabold text-ink text-center">
            Termos de Uso e Política de Privacidade
          </h1>
          <p className="text-xs text-muted text-center">Última atualização: maio de 2026</p>
        </div>

        <div className="flex flex-col gap-8">
          <p className="text-sm text-body leading-relaxed">
            Bem-vindo ao <strong>Tchê PetHub</strong>. Ao utilizar nossa plataforma, você concorda
            com estes Termos de Uso e com nossa Política de Privacidade, elaborados em conformidade
            com a <strong>Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</strong>.
          </p>

          <Section id="sobre" title="1. Sobre a Plataforma">
            <p>
              O Tchê PetHub é uma plataforma digital voltada ao bem-estar animal que conecta
              tutores, adotantes, ONGs e profissionais do setor pet. Nossa missão é facilitar a
              adoção responsável, o registro da vida dos animais e a conexão da comunidade pet
              gaúcha e brasileira.
            </p>
          </Section>

          <Section id="anuncios" title="2. Responsabilidade pelos Anúncios e Dados de Contato">
            <p>
              Cada usuário é <strong>integralmente responsável</strong> pelo conteúdo dos anúncios
              que publica na plataforma — incluindo textos, imagens e dados de contato (e-mail,
              telefone e WhatsApp). O Tchê PetHub não verifica nem endossa as informações
              publicadas.
            </p>
            <p>
              Ao criar um anúncio público (adoção, achados e perdidos ou serviços), os{' '}
              <strong>dados de contato informados ficam visíveis para todos os usuários
              cadastrados</strong> na plataforma. Ao publicar o anúncio, você declara estar
              ciente dessa visibilidade e consente com ela.
            </p>
            <p>
              O Tchê PetHub não se responsabiliza pelo uso indevido que terceiros possam fazer
              dos dados de contato divulgados voluntariamente pelos próprios usuários.
            </p>
          </Section>

          <Section id="adocao" title="3. Adoção de Animais">
            <p>
              O Tchê PetHub atua exclusivamente como <strong>intermediário digital</strong> entre
              doadores e adotantes. Não nos responsabilizamos por:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>
                As condições de saúde, comportamento ou histórico dos animais anunciados para
                adoção;
              </li>
              <li>
                A conduta, intenções ou capacidade dos adotantes interessados;
              </li>
              <li>
                Qualquer dano, perda ou situação adversa decorrente do processo de adoção.
              </li>
            </ul>
            <p>
              Recomendamos que doadores e adotantes realizem o processo de forma presencial, com
              acompanhamento adequado, e que o doador verifique as condições do novo lar antes de
              efetuar a entrega do animal.
            </p>
          </Section>

          <Section id="tutela" title="4. Transferência de Tutela">
            <p>
              A plataforma permite a transferência formal da tutela de um pet entre usuários
              cadastrados. Esse recurso foi desenvolvido para{' '}
              <strong>
                facilitar o compartilhamento de documentos e informações de saúde
              </strong>{' '}
              — como exames, vacinas e histórico clínico — entre tutores atuais e futuros.
            </p>
            <p>
              A transferência de tutela registrada no Tchê PetHub{' '}
              <strong>não possui valor jurídico</strong> e não substitui documentos legais de
              cessão de animal. Ela existe exclusivamente para fins de organização e continuidade
              do cuidado dentro da plataforma.
            </p>
          </Section>

          <Section id="privacidade" title="5. Privacidade e LGPD">
            <Subsection title="5.1 Dados Coletados">
              <p>Coletamos os seguintes dados pessoais:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1">
                <li>
                  <strong>Cadastro:</strong> nome, e-mail, CPF e senha (armazenada com hash
                  seguro — nunca em texto puro).
                </li>
                <li>
                  <strong>Anúncios:</strong> dados de contato que você voluntariamente inclui ao
                  publicar.
                </li>
                <li>
                  <strong>Pets:</strong> nome, espécie, raça, data de nascimento, foto e
                  histórico de saúde.
                </li>
              </ul>
            </Subsection>

            <Subsection title="5.2 Finalidade do Tratamento">
              <p>Os dados são utilizados para:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1">
                <li>Identificação e autenticação do usuário;</li>
                <li>Exibição de anúncios e conexão entre usuários;</li>
                <li>Gestão da vida e saúde dos pets cadastrados;</li>
                <li>Comunicações sobre o uso da plataforma.</li>
              </ul>
            </Subsection>

            <Subsection title="5.3 Base Legal">
              <p>
                O tratamento de dados tem como base legal o{' '}
                <strong>consentimento</strong> (art. 7º, I da LGPD) e a{' '}
                <strong>execução do contrato</strong> estabelecido por estes Termos (art. 7º, V).
              </p>
            </Subsection>

            <Subsection title="5.4 Seus Direitos">
              <p>Nos termos da LGPD, você pode a qualquer momento:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1">
                <li>Confirmar a existência de tratamento dos seus dados;</li>
                <li>Acessar, corrigir ou atualizar seus dados;</li>
                <li>Solicitar a exclusão dos seus dados da plataforma;</li>
                <li>Revogar o consentimento dado.</li>
              </ul>
              <p>
                Para exercer esses direitos, entre em contato pelo e-mail{' '}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-[--color-primary] font-medium hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </Subsection>

            <Subsection title="5.5 Compartilhamento de Dados">
              <p>
                Não vendemos nem compartilhamos seus dados com terceiros para fins comerciais.
                Dados podem ser compartilhados apenas quando exigido por lei ou ordem judicial.
              </p>
            </Subsection>
          </Section>

          <Section id="conduta" title="6. Conduta do Usuário">
            <p>É vedado utilizar a plataforma para:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Publicar conteúdo falso, enganoso ou prejudicial a animais;</li>
              <li>
                <strong>Comercializar animais</strong> — a plataforma é exclusiva para adoção
                gratuita;
              </li>
              <li>Assediar, ameaçar ou prejudicar outros usuários;</li>
              <li>Violar qualquer legislação brasileira aplicável.</li>
            </ul>
          </Section>

          <Section id="alteracoes" title="7. Alterações nestes Termos">
            <p>
              Podemos atualizar estes Termos periodicamente. Notificaremos os usuários sobre
              mudanças relevantes pelo e-mail cadastrado. O uso continuado da plataforma após as
              alterações implica aceitação dos novos termos.
            </p>
          </Section>

          <Section id="contato" title="8. Contato">
            <p>
              Dúvidas, sugestões ou solicitações relacionadas a estes Termos ou à sua
              privacidade? Entre em contato conosco:
            </p>
            <div className="flex items-center gap-3 mt-2 p-4 bg-green-light rounded-xl border border-line">
              <span className="text-2xl" aria-hidden="true">📧</span>
              <div>
                <p className="font-semibold text-ink">E-mail</p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-[--color-primary] font-medium hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
            <p className="text-xs text-muted mt-1">
              Respondemos em até 5 dias úteis.
            </p>
          </Section>
        </div>

        <div className="mt-10 pt-6 border-t border-line text-center">
          <p className="text-sm text-muted">
            Obrigado por fazer parte da comunidade Tchê PetHub.
            <br />
            Juntos, cuidamos de quem a gente ama. 🐾
          </p>
          <Link
            to={ROUTES.HOME}
            className="inline-block mt-4 text-sm text-[--color-primary] font-medium hover:underline"
          >
            ← Voltar para o início
          </Link>
        </div>
      </div>
    </PublicLayout>
  )
}
