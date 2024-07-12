import {Button, buttonVariants} from "@/components/ui/button";
import Link from 'next/link';

export default function PortalPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold">Página do Portal</h1>
      <div className="flex gap-2">
      <Button>Clique Aqui</Button>

      <Link href="/api/logout" className={buttonVariants({variant: "destructive"})}>
        Logout
      </Link>
    </div>      
    </main>
  );
}


/**
import Link from 'next/link';

export default function PortalPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold">Página do Portal</h1>

      <Link href="/api/logout">Logout</Link>
    </main>
  );
}
 */

