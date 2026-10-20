export const metadata = {
  title: "Muscle Dynamics",
  description: "Your gym. Your training. All in one place.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
