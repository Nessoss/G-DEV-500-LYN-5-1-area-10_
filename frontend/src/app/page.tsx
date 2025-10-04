import { Home, Settings } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex">
        
        <Home className="w-6 h-6 text-blue-500" />

        <Settings size={32} color="red" />
      </div>
    </div>
  );
}
