export const categories = [
  "Tradisi dan Upacara Adat",
  "Norma dan Nilai Adat",
  "Benda dan Peninggalan Budaya",
  "Cerita Lisan dan Sejarah",
  "Tokoh dan Pelaku Budaya",
  "Situs dan Lokasi Budaya",
  "Pengetahuan Lokal",
];
export type Role = "visitor" | "contributor" | "verifier" | "admin";
export type Status =
  "draft" | "pending" | "revision" | "approved" | "rejected" | "published";
export type Entry = {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  source: string;
  status: Status;
  access: "shared" | "restricted" | "sacred";
  image: string;
  code?: string;
  note?: string;
  media?: { name: string; type: string; url: string }[];
  history: string[];
  related: string[];
};
const mountain =
  "https://images.unsplash.com/photo-1649728424554-55f112320480?auto=format&fit=crop&w=1400&q=85";
export const hero = mountain;
export const seed: Entry[] = [
  {
    id: "yadnya-kasada",
    title: "Yadnya Kasada",
    category: categories[0],
    location: "Ngadisari",
    description:
      "Contoh dokumentasi pengantar tradisi Yadnya Kasada di kawasan Tengger. Ruang ini dirancang untuk mencatat konteks, narasumber, dan dokumentasi yang kelak disahkan oleh masyarakat adat. Isi demonstrasi bukan rujukan budaya atau uraian tata ritual.",
    source: "Narasumber simulasi — warga adat",
    status: "published",
    access: "shared",
    image: mountain,
    history: ["Contoh persetujuan publikasi oleh pemuka adat"],
    related: ["ongkek", "kisah-tengger"],
  },
  {
    id: "ongkek",
    title: "Ongkek, wadah persembahan",
    category: categories[2],
    location: "Ngadisari",
    description:
      "Contoh pencatatan benda budaya: nama, material, kondisi, asal, penanggung jawab, dan keterkaitannya dengan tradisi. Deskripsi dan kode ini adalah data demonstrasi yang perlu dikonfirmasi pemilik pengetahuan.",
    source: "Narasumber simulasi — pelaku budaya",
    status: "published",
    access: "shared",
    code: "LST-BND-NGD-0001",
    image: "/ilustrasi-benda.svg",
    history: ["Contoh inventaris dan persetujuan akses"],
    related: ["yadnya-kasada"],
  },
  {
    id: "kisah-tengger",
    title: "Cerita dari lereng Tengger",
    category: categories[3],
    location: "Wonokitri",
    description:
      "Contoh arsip cerita lisan dari lereng Tengger. Rekaman, transkripsi, dan izin narasumber dapat disimpan sebagai satu dokumentasi. Tidak memuat kutipan atau kisah yang diklaim telah disahkan.",
    source: "Narasumber simulasi — penutur cerita",
    status: "published",
    access: "shared",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80",
    history: ["Contoh persetujuan narasumber"],
    related: ["yadnya-kasada"],
  },
  {
    id: "gotong-royong",
    title: "Merawat kebersamaan",
    category: categories[1],
    location: "Ngadas",
    description:
      "Contoh dokumentasi nilai kebersamaan dalam kehidupan warga. Uraian adat harus ditinjau oleh narasumber berwenang sebelum menjadi rujukan.",
    source: "Narasumber simulasi",
    status: "published",
    access: "shared",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80",
    history: ["Contoh publikasi"],
    related: [],
  },
  {
    id: "arsip-internal",
    title: "Contoh arsip terbatas",
    category: categories[0],
    location: "Internal",
    description:
      "Materi simulasi untuk menguji pembatasan akses. Tidak berisi pengetahuan sakral yang sebenarnya.",
    source: "Pemuka adat simulasi",
    status: "approved",
    access: "sacred",
    image: mountain,
    history: ["Akses sakral ditetapkan oleh admin simulasi"],
    related: [],
  },
  {
    id: "catatan-pertanian",
    title: "Catatan pertanian lereng",
    category: categories[6],
    location: "Wonokitri",
    description:
      "Contoh catatan pengetahuan lokal yang menunggu peninjauan narasumber dan verifikator.",
    source: "Warga adat simulasi",
    status: "pending",
    access: "shared",
    image: mountain,
    history: ["Dikirim untuk verifikasi"],
    related: [],
  },
  {
    id: "pelaku-budaya",
    title: "Penutur dan penjaga ingatan",
    category: categories[4],
    location: "Ngadas",
    description:
      "Profil demonstrasi pelaku budaya: ruang untuk biografi, bidang keahlian, rekam kontribusi, dan persetujuan penggunaan profil. Nama dan identitas narasumber nyata belum dimasukkan.",
    source: "Pelaku budaya simulasi",
    status: "published",
    access: "shared",
    image: mountain,
    history: ["Persetujuan profil simulasi"],
    related: ["kisah-tengger"],
  },
  {
    id: "lanskap-tengger",
    title: "Lanskap budaya Tengger",
    category: categories[5],
    location: "Wonokitri",
    description:
      "Contoh inventaris lokasi budaya di kawasan pegunungan Tengger. Pencatatan lokasi sensitif memerlukan izin pemuka adat. Titik pada peta prototype hanya skema dan tidak menunjukkan situs sakral.",
    source: "Warga adat simulasi",
    status: "published",
    access: "shared",
    image: mountain,
    history: ["Persetujuan lokasi simulasi"],
    related: ["kisah-tengger"],
  },
  {
    id: "pengetahuan-ladang",
    title: "Ingatan dari ladang",
    category: categories[6],
    location: "Ngadas",
    description:
      "Contoh dokumentasi pengetahuan warga mengenai kehidupan di lahan pegunungan: catatan musim, istilah lokal, dan pengalaman turun-temurun. Belum memuat petunjuk pertanian atau klaim adat yang telah diverifikasi.",
    source: "Petani simulasi — warga adat",
    status: "published",
    access: "shared",
    image: mountain,
    history: ["Persetujuan narasumber simulasi"],
    related: ["gotong-royong"],
  },
];
export const labels: Record<Status, string> = {
  draft: "Draft",
  pending: "Menunggu verifikasi",
  revision: "Perlu revisi",
  approved: "Disetujui verifikator",
  rejected: "Ditolak",
  published: "Dipublikasikan",
};
export function isPublic(e: Entry) {
  return e.status === "published" && e.access === "shared";
}
