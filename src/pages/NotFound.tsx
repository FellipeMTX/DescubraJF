import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-primary-600">404</h1>
      <p className="mt-4 text-xl text-gray-600">Página não encontrada</p>
      <Link
        to="/"
        className="mt-6 rounded-md bg-primary-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-700"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
