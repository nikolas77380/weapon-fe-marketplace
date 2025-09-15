import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";
import { getServerCurrentUser } from "@/lib/server-auth";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations('NotFound');
  const currentUser = await getServerCurrentUser();

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto">

          <div className="mb-8">
            <h1 className="text-9xl font-bold text-primary/20 select-none">
              404
            </h1>
          </div>

          <div className="mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              {t('titleNotFound')}
            </h2>
            <p className="text-xl font-medium text-muted-foreground mb-2">
              {t('descriptionNotFound')}
            </p>
            <p className="text-muted-foreground">
              {t('descriptionNotFound2')}
            </p>
          </div>

          <div className="flex justify-center items-center">
            <Button asChild size="lg">
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                {t('buttonGoHome')}
              </Link>
            </Button>
          </div>

          <div className="mt-12 p-6 bg-muted/50 border border-border">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Search className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground">
                {t('searchSuggestion')}
              </h3>
            </div>
            <p className="text-muted-foreground mb-4">
              {currentUser
                ? t('currentUserDescription')
                : t('notCurrentUserDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="secondary"
                asChild
                className="px-5 py-2 shadow-md"
              >
                <Link href="/">{t('buttonProductCatalog')}</Link>
              </Button>
              {!currentUser && (
                <Button
                  variant="secondary"
                  asChild
                  className="px-5 py-2 shadow-md"
                >
                  <Link href="/auth">{t('buttonLogReg')}</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
