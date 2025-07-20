'use client';
import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#333",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1
        style={{
          fontSize: "4rem",
          marginBottom: "1rem",
          color: "#FF6F91",
          textShadow: "2px 2px 4px #ffccd5",
          animation: "bounce 2s infinite",
        }}
      >
        Dobrodošli!
      </h1>

      <p
        style={{
          fontSize: "1.5rem",
          marginBottom: "3rem",
          color: "#333",
          maxWidth: "400px",
        }}
      >
        Izaberite omiljene stavke iz ponude.
      </p>

      <Link
        href="/menu"
        style={{
          backgroundColor: "#FF6F91",
          color: "white",
          padding: "1rem 3rem",
          borderRadius: "50px",
          fontSize: "1.25rem",
          fontWeight: "bold",
          boxShadow: "0 4px 15px rgba(255, 111, 145, 0.4)",
          transition: "background-color 0.3s ease",
          textDecoration: "none",
          display: "inline-block", // da padding i border-radius lepo rade
          cursor: "pointer",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ff5178")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FF6F91")}
      >
        Pogledaj meni
      </Link>;

      <style jsx>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
      `}</style>
    </div>
  );
}
