export default function Footer() {
  return (
    <footer className="p-4 border-t text-center text-gray-600 bg-white shadow-sm">
      &copy; {new Date().getFullYear()} Hotel Management. All rights reserved.
    </footer>
  )
}