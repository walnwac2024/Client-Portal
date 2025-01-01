import { siteConfig } from "@/config/site.config";
import { UserDataProvider } from "@/components/UserDataContext";
import ClientContent from "@/components/ClientContent";

export const metadata = {
  title: `Client Management | ${siteConfig.title}`,
  description: "View and manage your clients efficiently",
};

export default function Home({ userDataFromServer }: { userDataFromServer: any }) {
  return (
    <UserDataProvider initialData={userDataFromServer}>
      <ClientContent />
    </UserDataProvider>
  );
}