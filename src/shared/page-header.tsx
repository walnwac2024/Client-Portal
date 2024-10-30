// import { Title } from '@/components/ui/text';
import { cn } from '@/lib/utils';

export type PageHeaderTypes = {
  title: string;
  breadcrumb: { name: string; href?: string }[];
  className?: string;
};

export default function PageHeader({
  title,
  breadcrumb,
  children,
  className,
}: React.PropsWithChildren<PageHeaderTypes>) {
  return (
    <header className={cn('mb-6 @container xs:-mt-2 lg:mb-7', className)}>
      <div className="flex flex-col @lg:flex-row @lg:items-center @lg:justify-between">
        <div>
          {/* <Title
            as="h2"
            className="mb-2 text-[22px] lg:text-2xl 4xl:text-[26px]"
          > */}
            {title}
          {/* </Title> */}

        </div>
        {children}
      </div>
    </header>
  );
}
