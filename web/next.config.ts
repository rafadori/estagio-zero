import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Padrão é 1MB — pouco pra foto de capa de matéria. As actions de
      // post (src/lib/actions/posts.ts) também rejeitam arquivo > 8MB
      // antes de subir pro Blob, então esse valor é só a folga do limite
      // bruto do multipart/form-data.
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
