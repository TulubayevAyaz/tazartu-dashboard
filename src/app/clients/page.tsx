import { Suspense } from "react";
import { ClientsView } from "./ClientsView";

export default function ClientsPage() {
  return (
    <Suspense fallback={null}>
      <ClientsView />
    </Suspense>
  );
}
