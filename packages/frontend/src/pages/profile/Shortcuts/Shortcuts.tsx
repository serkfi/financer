import { IconName } from '../../../components/icon/icon';
import { LinkList } from '../../../components/link-list/link-list';
import { LinkListLink } from '../../../components/link-list/link-list.link';
import { QuickLinksItem } from '../../../components/quick-links/quick-links.item';
import { UpdatePageInfo } from '../../../components/seo/updatePageInfo';
import { useAllTransactionTemplates } from '../../../hooks/transactionTemplate/useAllTransactionTemplates';

export const Shortcuts = (): JSX.Element => {
  const transactionTemplatesRaw = useAllTransactionTemplates();

  return (
    <>
      <UpdatePageInfo title="Shortcuts" backLink="/profile" />
      <section className="grid gap-8">
        <section>
          <QuickLinksItem
            title="Add shortcut"
            link="/profile/shortcuts/add"
            iconName={IconName.lightningBolt}
            iconBackgroundColor="blue"
            testId="add-shortcut"
          />
        </section>
        <LinkList testId="shortcuts-link-list">
          {transactionTemplatesRaw.map(({ templateName, _id: id }) => (
            <LinkListLink
              link={`/profile/shortcuts/${id}/edit`}
              key={id}
              testId="shortcuts-row"
            >
              {templateName}
            </LinkListLink>
          ))}
        </LinkList>
      </section>
    </>
  );
};
