"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Search,
  Mountain,
  Leaf,
  MapPin,
  ShieldCheck,
  BookOpen,
  Menu,
  X,
  Plus,
  LayoutDashboard,
  Package,
  ClipboardCheck,
  Lock,
  LogOut,
  AudioLines,
  Users,
  Compass,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  categories,
  seed,
  hero,
  labels,
  isPublic,
  type Entry,
  type Role,
  type Status,
} from "@/lib/data";
const roles: Record<Role, string> = {
  visitor: "Visitor",
  contributor: "Warga Adat",
  verifier: "Verifikator",
  admin: "Pemuka Adat / Admin",
};
const icons = [Mountain, Leaf, Package, BookOpen, Users, MapPin, Compass];
const short = [
  "Tradisi & Upacara",
  "Norma & Nilai",
  "Benda Budaya",
  "Cerita & Sejarah",
  "Tokoh Budaya",
  "Situs & Lokasi",
  "Pengetahuan Lokal",
];
const paths = [
  "/internal/dashboard",
  "/internal/tambah",
  "/internal/inventaris",
  "/internal/verifikasi",
  "/internal/arsip",
];
const names = [
  "Dashboard",
  "Tambah Dokumentasi",
  "Inventaris Benda",
  "Verifikasi",
  "Arsip Terbatas",
];
const navIcons = [LayoutDashboard, Plus, Package, ClipboardCheck, Lock];
function Photo({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`photo ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        sizes="(max-width: 700px) 100vw, 50vw"
      />
    </div>
  );
}
function Badge({ children }: { children: React.ReactNode }) {
  return <span className="badge">{children}</span>;
}
export default function Lestari() {
  const path = usePathname(),
    router = useRouter();
  const [ready, setReady] = useState(false),
    [entries, setEntries] = useState<Entry[]>(seed),
    [role, setRole] = useState<Role>("visitor"),
    [menu, setMenu] = useState(false),
    [query, setQuery] = useState(""),
    [category, setCategory] = useState("Semua"),
    [location, setLocation] = useState("Semua"),
    [notice, setNotice] = useState(""),
    [audit, setAudit] = useState<string[]>([]),
    [selected, setSelected] = useState("Ngadisari");
  useEffect(() => {
    try {
      const data = localStorage.getItem("lestari-v1");
      if (data) {
        const d = JSON.parse(data);
        setEntries(
          d.entries
            ? [
                ...seed.map((s) => ({
                  ...s,
                  ...d.entries.find((e: Entry) => e.id === s.id),
                  image: s.image,
                })),
                ...d.entries.filter(
                  (e: Entry) => !seed.some((s) => s.id === e.id),
                ),
              ]
            : seed,
        );
        setRole(d.role || "visitor");
        setAudit(d.audit || []);
      }
    } catch {
      setNotice(
        "Penyimpanan lokal tidak dapat dibaca. Data demonstrasi dimuat.",
      );
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(
          "lestari-v1",
          JSON.stringify({ entries, role, audit }),
        );
      } catch {
        setNotice(
          "Penyimpanan penuh. Perubahan hanya tersedia selama sesi ini.",
        );
      }
    }
  }, [ready, entries, role, audit]);
  useEffect(() => {
    setMenu(false);
    setNotice("");
    const params = new URLSearchParams(window.location.search);
    if (path === "/search") setQuery(params.get("q") || "");
    if (path === "/jelajahi")
      setCategory(
        params.has("kategori")
          ? categories[Number(params.get("kategori"))] || "Semua"
          : "Semua",
      );
  }, [path]);
  const publicEntries = entries.filter(isPublic);
  const internal = path.startsWith("/internal");
  const allowed =
    role !== "visitor" &&
    (path !== "/internal/verifikasi" ||
      role === "verifier" ||
      role === "admin") &&
    (path !== "/internal/arsip" || role === "admin") &&
    (path !== "/internal/tambah" || role === "contributor");
  function change(
    id: string,
    status: Status,
    note = "",
    access?: Entry["access"],
  ) {
    const target = entries.find((e) => e.id === id);
    if (!target) return;
    if (status === "published" && role !== "admin") return;
    if (
      ["approved", "revision", "rejected"].includes(status) &&
      !["admin", "verifier"].includes(role)
    )
      return;
    const log = `${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })} · ${roles[role]} · ${target.title} → ${labels[status]}${note ? ` · ${note}` : ""}`;
    setEntries((es) =>
      es.map((e) =>
        e.id === id
          ? {
              ...e,
              status,
              note,
              access: access || e.access,
              history: [...e.history, log],
            }
          : e,
      ),
    );
    setAudit((a) => [log, ...a]);
    setNotice("Perubahan berhasil disimpan.");
  }
  const results = publicEntries.filter(
    (e) =>
      `${e.title} ${e.description} ${e.location}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (category === "Semua" || e.category === category) &&
      (location === "Semua" || e.location === location),
  );
  function SearchBox() {
    return (
      <form
        className="search-box"
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/search?q=" + encodeURIComponent(query));
        }}
      >
        <Search size={20} />
        <input
          aria-label="Cari pengetahuan budaya"
          placeholder="Cari tradisi, cerita, benda budaya..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">
          Cari <ArrowRight size={16} />
        </button>
      </form>
    );
  }
  function Listing() {
    return (
      <>
        <div className="page-heading">
          <span className="eyebrow">RUANG PENGETAHUAN</span>
          <h1>
            {path === "/search"
              ? "Temukan pengetahuan budaya"
              : "Jelajahi warisan Tengger"}
          </h1>
          <p>
            Setiap cerita, benda, dan tradisi adalah bagian dari identitas yang
            kita rawat bersama.
          </p>
        </div>
        {SearchBox()}
        <div className="filters">
          <label>
            Kategori
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Semua</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Lokasi
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option>Semua</option>
              {["Ngadisari", "Wonokitri", "Ngadas"].map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
          <span>{results.length} dokumentasi ditemukan</span>
        </div>
        <div className="cards">
          {results.map((e) => (
            <Card key={e.id} entry={e} />
          ))}
        </div>
        {!results.length && (
          <div className="empty">
            <Search />
            <h3>Belum ada hasil yang sesuai</h3>
            <p>Coba kata kunci lain atau ubah filter.</p>
            <button
              onClick={() => {
                setQuery("");
                setCategory("Semua");
                setLocation("Semua");
              }}
            >
              Hapus filter
            </button>
          </div>
        )}
      </>
    );
  }
  let content: React.ReactNode;
  if (path === "/")
    content = (
      <>
        <section className="hero">
          <Photo
            src={hero}
            alt="Ilustrasi lanskap pegunungan Tengger"
            className="hero-photo"
          />
          <div className="hero-shade" />
          <div className="hero-content">
            <span className="hero-tag">
              <span />
              DARI TENGGER, UNTUK GENERASI MENDATANG
            </span>
            <h1>
              Merawat akar.
              <br />
              Menghidupkan <em>warisan.</em>
            </h1>
            <p>
              Ruang bersama untuk menjaga cerita, tradisi, dan pengetahuan
              budaya Tengger. Berakar pada masyarakat, lestari lintas generasi.
            </p>
            <div className="actions">
              <Link className="button light" href="/jelajahi">
                Jelajahi budaya <ArrowUpRight size={18} />
              </Link>
              <Link className="hero-link" href="/tentang">
                Mengenal LESTARI <ArrowRight size={17} />
              </Link>
            </div>
          </div>
          <span className="hero-caption">
            <MapPin size={14} /> Tanah Tengger, Jawa Timur <span>01 — 03</span>
          </span>
        </section>
        <div className="trust-strip">
          <span>
            <ShieldCheck />
            Pengetahuan dijaga masyarakat adat
          </span>
          <span>
            <BookOpen />
            Dokumentasi dengan izin narasumber
          </span>
          <span>
            <Leaf />
            Warisan untuk generasi mendatang
          </span>
        </div>
        <section className="section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">KENALI LEBIH DEKAT</span>
              <h2>Satu tanah, banyak pengetahuan.</h2>
            </div>
            <p>
              Temukan kekayaan budaya Tengger
              <br />
              melalui tujuh ruang pengetahuan.
            </p>
          </div>
          <div className="category-grid">
            {categories.map((c, i) => {
              const Icon = icons[i];
              return (
                <Link
                  key={c}
                  href={`/jelajahi?kategori=${i}`}
                  onClick={() => setCategory(c)}
                >
                  <Icon size={26} />
                  <h3>{short[i]}</h3>
                  <span>
                    {publicEntries.filter((e) => e.category === c).length}{" "}
                    dokumentasi <ArrowUpRight size={15} />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
        <section className="section featured">
          <div className="section-heading">
            <div>
              <span className="eyebrow">CERITA YANG TERUS HIDUP</span>
              <h2>Dari ingatan, menjadi pengetahuan.</h2>
            </div>
            <Link className="text-link" href="/jelajahi">
              Lihat semua <ArrowRight size={17} />
            </Link>
          </div>
          <div className="cards">
            {publicEntries.slice(0, 3).map((e) => (
              <Card key={e.id} entry={e} />
            ))}
          </div>
        </section>
        <section className="mission">
          <div className="mission-art">
            <Mountain size={90} strokeWidth={1} />
            <span>AKAR · INGATAN · MASA DEPAN</span>
          </div>
          <div>
            <span className="eyebrow">DIJAGA BERSAMA, DIWARISKAN BERSAMA</span>
            <h2>
              Budaya hidup karena
              <br />
              ada yang merawatnya.
            </h2>
            <p>
              LESTARI memberi ruang bagi warga adat untuk mendokumentasikan
              pengetahuannya, dengan kendali penuh atas apa yang dapat
              dibagikan.
            </p>
            <Link className="button" href="/login">
              Mulai berkontribusi <ArrowUpRight size={18} />
            </Link>
          </div>
        </section>
      </>
    );
  else if (path === "/jelajahi" || path === "/search") content = Listing();
  else if (path === "/peta")
    content = (
      <MapView
        publicEntries={publicEntries}
        selected={selected}
        setSelected={setSelected}
      />
    );
  else if (path === "/tentang")
    content = (
      <div className="page-heading narrow">
        <Badge>TENTANG LESTARI</Badge>
        <h1>Pengetahuan milik masyarakat. Masa depan milik bersama.</h1>
        <p>
          LESTARI adalah ruang dokumentasi dan inventaris budaya Tengger, dengan
          verifikasi manusia dan persetujuan publikasi oleh pemuka adat.
        </p>
        <div className="panel">
          <h3>Kedaulatan pengetahuan</h3>
          <p>
            Sumber data berasal dari warga adat dan pihak berwenang. Pengetahuan
            sakral tetap berada dalam kendali pemuka adat. Seluruh konten
            prototype ini merupakan data demonstrasi, bukan dokumentasi budaya
            yang telah disahkan.
          </p>
        </div>
      </div>
    );
  else if (path === "/login")
    content = (
      <div className="login-layout">
        <div>
          <span className="eyebrow">RUANG MASYARAKAT ADAT</span>
          <h1>
            Jaga pengetahuan.
            <br />
            Lanjutkan warisan.
          </h1>
          <p>Pilih peran untuk mencoba alur dokumentasi LESTARI.</p>
          <Mountain size={110} strokeWidth={1} />
        </div>
        <div className="panel">
          <Badge>LOGIN SIMULASI</Badge>
          <h2>Selamat datang kembali</h2>
          <p>Tanpa kata sandi. Pilihan ini hanya untuk prototype.</p>
          {(["contributor", "verifier", "admin"] as Role[]).map((r) => (
            <button
              className="role-button"
              key={r}
              onClick={() => {
                setRole(r);
                router.push("/internal/dashboard");
              }}
            >
              <span>
                <strong>{roles[r]}</strong>
                <small>
                  {r === "contributor"
                    ? "Dokumentasi, draft, dan pengiriman"
                    : r === "verifier"
                      ? "Review, persetujuan, dan revisi"
                      : "Penetapan akses dan publikasi"}
                </small>
              </span>
              <ArrowRight size={20} />
            </button>
          ))}
          <Link
            className="text-link"
            href="/"
            onClick={() => setRole("visitor")}
          >
            Kembali sebagai visitor
          </Link>
        </div>
      </div>
    );
  else if (path.startsWith("/detail/")) {
    const e = entries.find((e) => e.id === path.split("/")[2]);
    const visible =
      e &&
      (isPublic(e) ||
        (ready &&
          role !== "visitor" &&
          (e.access === "shared" || role === "admin")));
    content = visible ? (
      <>
        <Link className="back" href="/jelajahi">
          ← Kembali ke jelajah
        </Link>
        <div className="detail-grid">
          <article>
            <Photo
              src={e.image}
              alt={`Ilustrasi ${e.title}`}
              className="detail-photo"
            />
            <div className="page-heading">
              <Badge>Data Demonstrasi</Badge>
              <h1>{e.title}</h1>
              <p>
                <MapPin size={16} /> {e.location} · {e.category}
              </p>
            </div>
            <h3>Tentang dokumentasi</h3>
            <p className="body-copy">{e.description}</p>
            {e.note && (
              <div className="panel">
                <h3>Catatan review</h3>
                <p>{e.note}</p>
              </div>
            )}
            {e.media?.map((m, i) => (
              <div className="media-item" key={i}>
                <h4>{m.name}</h4>
                {m.type.startsWith("image/") ? (
                  <Photo src={m.url} alt={m.name} />
                ) : m.type.startsWith("audio/") ? (
                  <audio controls src={m.url} />
                ) : m.type.startsWith("video/") ? (
                  <video controls src={m.url} />
                ) : (
                  <a href={m.url} download={m.name}>
                    Unduh PDF
                  </a>
                )}
              </div>
            ))}
            <h3>Pengetahuan terkait</h3>
            <div className="related">
              {e.related
                .map((id) => publicEntries.find((r) => r.id === id))
                .filter((r): r is Entry => !!r)
                .map((r) => (
                  <Link key={r.id} href={`/detail/${r.id}`}>
                    {r.title}
                    <ArrowUpRight size={16} />
                  </Link>
                ))}
            </div>
          </article>
          <aside>
            <div className="panel">
              <span className="eyebrow">CATATAN DOKUMENTASI</span>
              <h3>Identitas pengetahuan</h3>
              <label>
                Status<Badge>{labels[e.status]}</Badge>
              </label>
              <label>
                Akses<strong>{e.access}</strong>
              </label>
              <label>
                Narasumber<strong>{e.source}</strong>
              </label>
              {e.code && (
                <label>
                  Kode inventaris<strong className="code">{e.code}</strong>
                </label>
              )}
              <p className="demo-note">
                Simulasi persetujuan. Belum diverifikasi sebagai informasi
                budaya nyata.
              </p>
              <QRCodeSVG
                value={`${ready ? window.location.origin : "http://localhost:3001"}/detail/${e.id}`}
                size={100}
              />
              <small>QR tautan dokumentasi lokal</small>
            </div>
            {role !== "visitor" && (
              <div className="panel">
                <h3>Riwayat versi</h3>
                {e.history.map((h, i) => (
                  <p key={i}>{h}</p>
                ))}
              </div>
            )}
          </aside>
        </div>
      </>
    ) : (
      <div className="empty">
        <Lock />
        <h1>Dokumentasi tidak tersedia</h1>
        <p>Konten belum dipublikasikan atau akses Anda tidak sesuai.</p>
        <Link className="button" href="/jelajahi">
          Jelajahi data publik
        </Link>
      </div>
    );
  } else if (internal) {
    content = !ready ? (
      <p>Memuat sesi…</p>
    ) : !allowed ? (
      <div className="empty">
        <Lock />
        <h1>Akses terbatas</h1>
        <p>Halaman ini memerlukan peran yang sesuai.</p>
        <Link className="button" href="/login">
          Pilih peran simulasi
        </Link>
      </div>
    ) : (
      <div className="internal-shell">
        <aside className="sidebar">
          <span className="eyebrow">RUANG INTERNAL</span>
          {paths.map((p, i) => {
            const Icon = navIcons[i];
            return (i === 1 && role !== "contributor") ||
              (i === 3 && role === "contributor") ||
              (i === 4 && role !== "admin") ? null : (
              <Link className={path === p ? "active" : ""} key={p} href={p}>
                <Icon size={19} />
                {names[i]}
              </Link>
            );
          })}
          <div className="sidebar-note">
            <ShieldCheck />
            <p>
              Pengetahuan terlindungi.
              <br />
              Publikasi atas persetujuan adat.
            </p>
          </div>
        </aside>
        <div className="internal-main">
          <div className="page-heading">
            <span className="eyebrow">{roles[role]} · SIMULASI</span>
            <h1>{names[paths.indexOf(path)] || "Dashboard"}</h1>
            <p>
              Rawat dokumentasi dengan teliti, jaga izin dan hak narasumber.
            </p>
          </div>
          {path === "/internal/tambah" ? (
            <Documentation
              entries={entries}
              role={role}
              setEntries={setEntries}
              setAudit={setAudit}
              router={router}
            />
          ) : path === "/internal/verifikasi" ? (
            <>
              <p className="demo-note">
                Verifikator menilai dokumentasi. Pemuka adat menetapkan akses
                dan publikasi.
              </p>
              {entries
                .filter(
                  (e) =>
                    e.status === "pending" ||
                    (role === "admin" &&
                      e.status === "approved" &&
                      e.access === "shared"),
                )
                .map((e) => (
                  <Review
                    key={e.id}
                    entry={e}
                    role={role}
                    change={change}
                    setNotice={setNotice}
                  />
                ))}
              {!entries.some(
                (e) =>
                  e.status === "pending" ||
                  (role === "admin" &&
                    e.status === "approved" &&
                    e.access === "shared"),
              ) && (
                <div className="empty">
                  <ClipboardCheck />
                  <h3>Semua review telah ditangani</h3>
                </div>
              )}
            </>
          ) : path === "/internal/arsip" ? (
            <>
              <div className="panel">
                <Lock />
                <h3>Arsip dalam kendali pemuka adat</h3>
                <p>
                  Data restricted dan sacred hanya tersedia untuk peran admin
                  simulasi.
                </p>
              </div>
              <Table
                role={role}
                items={entries.filter((e) => e.access !== "shared")}
              />
              <div className="panel">
                <h3>Audit trail</h3>
                {audit.length ? (
                  audit.map((a, i) => <p key={i}>{a}</p>)
                ) : (
                  <p>Belum ada perubahan pada sesi ini.</p>
                )}
              </div>
            </>
          ) : path === "/internal/inventaris" ? (
            <Table
              role={role}
              items={entries.filter(
                (e) => e.code && (e.access === "shared" || role === "admin"),
              )}
            />
          ) : (
            <>
              <div className="stats">
                {[
                  [
                    "Dokumentasi",
                    entries.filter(
                      (e) => e.access === "shared" || role === "admin",
                    ).length,
                  ],
                  [
                    "Menunggu review",
                    entries.filter(
                      (e) => e.status === "pending" && e.access === "shared",
                    ).length,
                  ],
                  ["Dibagikan publik", publicEntries.length],
                ].map(([label, count]) => (
                  <div className="panel" key={label}>
                    <span>{label}</span>
                    <strong>{count}</strong>
                    <small>Data Demonstrasi</small>
                  </div>
                ))}
              </div>
              <div className="section-heading">
                <h3>Dokumentasi terbaru</h3>
                {role === "contributor" && (
                  <Link className="button" href="/internal/tambah">
                    <Plus size={16} />
                    Tambah data
                  </Link>
                )}
              </div>
              <Table
                role={role}
                items={entries.filter(
                  (e) => e.access === "shared" || role === "admin",
                )}
              />
            </>
          )}
        </div>
      </div>
    );
  } else
    content = (
      <div className="empty">
        <h1>Halaman tidak ditemukan</h1>
        <Link href="/">Kembali ke beranda</Link>
      </div>
    );
  return (
    <>
      <div className="topbar">
        Warisan yang dijaga. Pengetahuan yang dibagikan.
        <span>Prototype · Data Demonstrasi</span>
      </div>
      <header>
        <Link className="brand" href="/" aria-label="LESTARI beranda">
          <div className="brand-icon">
            <Mountain size={28} />
            <Leaf size={14} />
          </div>
          <div>
            LESTARI<small>WARISAN BUDAYA TENGGER</small>
          </div>
        </Link>
        <button
          className="menu-toggle secondary"
          aria-label="Buka navigasi"
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
        <nav className={menu ? "open" : ""}>
          <Link className={path === "/" ? "active" : ""} href="/">
            Beranda
          </Link>
          <Link
            className={path === "/jelajahi" ? "active" : ""}
            href="/jelajahi"
          >
            Jelajahi Budaya
          </Link>
          <Link className={path === "/peta" ? "active" : ""} href="/peta">
            Peta Budaya
          </Link>
          <Link href="/tentang">Tentang</Link>
          <Link href="/search" aria-label="Cari">
            <Search size={19} />
          </Link>
          {role === "visitor" ? (
            <Link className="button small" href="/login">
              Masuk <ArrowUpRight size={16} />
            </Link>
          ) : (
            <>
              <Link className="button small" href="/internal/dashboard">
                {roles[role]}
              </Link>
              <button
                className="logout"
                aria-label="Keluar"
                onClick={() => {
                  setRole("visitor");
                  router.push("/");
                }}
              >
                <LogOut size={18} />
              </button>
            </>
          )}
        </nav>
      </header>
      {notice && (
        <div className="notice" role="status">
          {notice}
          <button
            aria-label="Tutup pemberitahuan"
            onClick={() => setNotice("")}
          >
            <X size={16} />
          </button>
        </div>
      )}
      <main className={path === "/" ? "home" : "container"}>{content}</main>
      <footer>
        <div>
          <Link className="brand" href="/">
            LESTARI
            <Leaf size={23} />
          </Link>
          <p>
            Merawat pengetahuan, menjaga identitas.
            <br />
            Dari Tengger untuk generasi mendatang.
          </p>
        </div>
        <div>
          <span className="eyebrow">JELAJAHI</span>
          <Link href="/jelajahi">Pengetahuan budaya</Link>
          <Link href="/peta">Peta budaya</Link>
        </div>
        <div>
          <span className="eyebrow">BERSAMA LESTARI</span>
          <Link href="/tentang">Tentang kami</Link>
          <Link href="/login">Ruang warga adat</Link>
        </div>
        <div className="footer-bottom">
          <span>© 2026 LESTARI · Prototype Phase 1</span>
          <span>
            Data Demonstrasi · Seluruh pengetahuan memerlukan persetujuan adat.
          </span>
        </div>
      </footer>
    </>
  );
}

function Documentation({
  entries,
  role,
  setEntries,
  setAudit,
  router,
}: {
  entries: Entry[];
  role: Role;
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
  setAudit: React.Dispatch<React.SetStateAction<string[]>>;
  router: ReturnType<typeof useRouter>;
}) {
  const editId = new URLSearchParams(
    typeof window === "undefined" ? "" : window.location.search,
  ).get("edit");
  const editing = entries.find(
    (e) =>
      e.id === editId &&
      e.access === "shared" &&
      ["draft", "revision"].includes(e.status),
  );
  const [files, setFiles] = useState<Entry["media"]>(editing?.media || []),
    [error, setError] = useState("");
  async function upload(list: FileList | null) {
    if (!list) return;
    const collected: NonNullable<Entry["media"]> = [];
    for (const file of Array.from(list)) {
      if (file.size > 3 * 1024 * 1024) {
        setError("Maksimal 3 MB per file untuk simulasi lokal.");
        continue;
      }
      if (
        !/^(image|video|audio)\//.test(file.type) &&
        file.type !== "application/pdf"
      ) {
        setError("Gunakan foto, video, audio, atau PDF.");
        continue;
      }
      const url = await new Promise<string>((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.readAsDataURL(file);
      });
      collected.push({ name: file.name, type: file.type, url });
    }
    setFiles((f) => [...(f || []), ...collected]);
  }
  function save(form: HTMLFormElement, status: Status) {
    const d = new FormData(form);
    if (status === "pending" && !form.reportValidity()) return;
    if (!String(d.get("title") || "").trim()) {
      setError("Isi judul sebelum menyimpan draft.");
      return;
    }
    const id = editing?.id || `dokumentasi-${Date.now()}`;
    const cat = String(d.get("category"));
    const item: Entry = {
      id,
      title: String(d.get("title")),
      category: cat,
      location: String(d.get("location")),
      description: String(d.get("description")),
      source: String(d.get("source")),
      status,
      access: editing?.access || "shared",
      image: files?.find((f) => f.type.startsWith("image/"))?.url || hero,
      media: files,
      code:
        cat === categories[2]
          ? editing?.code ||
            `LST-BND-${({ Ngadisari: "NGD", Wonokitri: "WNK", Ngadas: "NGS" } as Record<string, string>)[String(d.get("location"))] || "LOC"}-${String(entries.filter((e) => e.code).length + 1).padStart(4, "0")}`
          : undefined,
      history: [
        ...(editing?.history || []),
        `Versi ${(editing?.history.length || 0) + 1} · ${labels[status]}`,
      ],
      related: [],
    };
    setEntries((es) =>
      editing ? es.map((e) => (e.id === id ? item : e)) : [...es, item],
    );
    setAudit((a) => [
      `${roles[role]} · ${item.title} · ${labels[status]}`,
      ...a,
    ]);
    router.push("/internal/dashboard");
  }
  return (
    <form
      className="document-form"
      onSubmit={(e) => {
        e.preventDefault();
        save(e.currentTarget, "pending");
      }}
    >
      <div className="panel">
        <h3>
          {editing
            ? "Perbarui dokumentasi"
            : "Pengetahuan yang ingin Anda dokumentasikan"}
        </h3>
        <label>
          Judul dokumentasi
          <input
            name="title"
            required
            defaultValue={editing?.title}
            placeholder="Tuliskan nama tradisi, benda, atau cerita"
          />
        </label>
        <div className="form-row">
          <label>
            Kategori
            <select name="category" defaultValue={editing?.category}>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Lokasi
            <select name="location" defaultValue={editing?.location}>
              {["Ngadisari", "Wonokitri", "Ngadas"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Deskripsi
          <textarea
            name="description"
            required
            defaultValue={editing?.description}
            rows={6}
            placeholder="Ceritakan konteks, asal, dan pengetahuan yang diizinkan narasumber."
          />
        </label>
        <label>
          Narasumber dan kewenangan
          <input
            name="source"
            required
            defaultValue={editing?.source}
            placeholder="Nama, peran adat, dan dasar izin dokumentasi"
          />
        </label>
        <label className="check">
          <input type="checkbox" required />
          Saya memiliki izin narasumber untuk mendokumentasikan data ini.
        </label>
      </div>
      <div className="panel">
        <h3>Media pendukung</h3>
        <label className="upload">
          <Plus />
          Pilih foto, video, audio, atau PDF
          <input
            type="file"
            multiple
            accept="image/*,video/*,audio/*,application/pdf"
            onChange={(e) => upload(e.target.files)}
          />
          <small>Maksimal 3 MB per file · tersimpan lokal di browser</small>
        </label>
        {files?.map((f, i) => (
          <div className="file" key={i}>
            {f.name}
            <button
              type="button"
              onClick={() => setFiles((fs) => fs?.filter((_, j) => j !== i))}
            >
              Hapus
            </button>
          </div>
        ))}
        {error && <p role="alert">{error}</p>}
      </div>
      <div className="panel subtle">
        <AudioLines />
        <h3>Asisten AI</h3>
        <p>
          Transkripsi, ringkasan, dan saran tag akan tersedia pada fase
          berikutnya. Penilaian budaya tetap dilakukan manusia.
        </p>
        <Badge>Placeholder</Badge>
      </div>
      <div className="actions">
        <button
          type="button"
          className="secondary"
          onClick={(e) => save(e.currentTarget.form!, "draft")}
        >
          Simpan draft
        </button>
        <button type="submit">
          Kirim untuk verifikasi <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
}
function Review({
  entry,
  role,
  change,
  setNotice,
}: {
  entry: Entry;
  role: Role;
  change: (
    id: string,
    status: Status,
    note?: string,
    access?: Entry["access"],
  ) => void;
  setNotice: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [note, setNote] = useState(""),
    [access, setAccess] = useState<Entry["access"]>(entry.access);
  return (
    <div className="panel review">
      <Badge>{labels[entry.status]}</Badge>
      <h3>{entry.title}</h3>
      <p>{entry.description}</p>
      <p>
        <strong>Narasumber:</strong> {entry.source}
      </p>
      <Link href={`/detail/${entry.id}`}>Lihat dokumentasi lengkap ↗</Link>
      <label>
        Catatan review
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Alasan revisi atau penolakan"
        />
      </label>
      {entry.status === "pending" && (
        <div className="actions">
          <button onClick={() => change(entry.id, "approved", note)}>
            Setujui verifikasi
          </button>
          <button
            className="secondary"
            onClick={() =>
              note.trim()
                ? change(entry.id, "revision", note)
                : setNotice("Isi catatan untuk meminta revisi.")
            }
          >
            Minta revisi
          </button>
          <button
            className="danger"
            onClick={() =>
              note.trim()
                ? change(entry.id, "rejected", note)
                : setNotice("Isi alasan penolakan.")
            }
          >
            Tolak
          </button>
        </div>
      )}
      {role === "admin" && entry.status === "approved" && (
        <>
          <label>
            Penetapan akses
            <select
              value={access}
              onChange={(e) => setAccess(e.target.value as Entry["access"])}
            >
              <option value="shared">Shared — publik</option>
              <option value="restricted">Restricted — internal</option>
              <option value="sacred">Sacred — pemuka adat</option>
            </select>
          </label>
          <button
            onClick={() => {
              if (access === "shared")
                change(entry.id, "published", note, access);
              else change(entry.id, "approved", note, access);
            }}
          >
            {access === "shared"
              ? "Setujui publikasi"
              : "Simpan ke arsip terbatas"}
          </button>
        </>
      )}
    </div>
  );
}

function Card({ entry }: { entry: Entry }) {
  return (
    <Link className="culture-card" href={`/detail/${entry.id}`}>
      <Photo src={entry.image} alt={`Ilustrasi ${entry.title}`} />
      <div className="card-body">
        <div className="eyebrow">
          {short[categories.indexOf(entry.category)] || entry.category}
          <ArrowUpRight size={17} />
        </div>
        <h3>{entry.title}</h3>
        <p>{entry.description}</p>
        <div className="card-meta">
          <span>
            <MapPin size={13} />
            {entry.location}
          </span>
          <span>Data Demonstrasi</span>
        </div>
      </div>
    </Link>
  );
}

function Table({ items, role }: { items: Entry[]; role: Role }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Dokumentasi</th>
            <th>Lokasi / kode</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.map((e) => (
            <tr key={e.id}>
              <td>
                <strong>{e.title}</strong>
                <small>{e.category}</small>
              </td>
              <td>
                {e.location}
                <small>{e.code || "—"}</small>
              </td>
              <td>
                <Badge>{labels[e.status]}</Badge>
              </td>
              <td>
                <Link href={`/detail/${e.id}`}>Lihat ↗</Link>
                {role === "contributor" &&
                  ["draft", "revision"].includes(e.status) && (
                    <Link
                      className="edit"
                      href={`/internal/tambah?edit=${e.id}`}
                    >
                      Edit & kirim
                    </Link>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!items.length && <p className="empty">Belum ada dokumentasi.</p>}
    </div>
  );
}

function MapView({
  publicEntries,
  selected,
  setSelected,
}: {
  publicEntries: Entry[];
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">JEJAK DI TANAH TENGGER</span>
        <h1>Peta budaya</h1>
        <p>Menjelajahi hubungan pengetahuan dengan tempat asalnya.</p>
      </div>
      <div className="map-layout">
        <div className="map">
          <div className="contour c1" />
          <div className="contour c2" />
          <div className="contour c3" />
          <span className="mountain-label">
            <Mountain size={40} />
            KAWASAN TENGGER
          </span>
          {["Ngadisari", "Wonokitri", "Ngadas"].map((l, i) => (
            <button
              style={{
                left: `${[65, 28, 52][i]}%`,
                top: `${[30, 45, 72][i]}%`,
              }}
              className={`pin ${selected === l ? "active" : ""}`}
              key={l}
              onClick={() => setSelected(l)}
            >
              <MapPin size={22} />
              {l}
            </button>
          ))}
          <small className="map-caption">
            Peta skematis demonstrasi · bukan koordinat situs adat
          </small>
        </div>
        <div className="panel">
          <Badge>LOKASI TERPILIH</Badge>
          <h2>{selected}</h2>
          <p>Dokumentasi publik dari lokasi ini.</p>
          {publicEntries
            .filter((e) => e.location === selected)
            .map((e) => (
              <Link className="map-entry" href={`/detail/${e.id}`} key={e.id}>
                {e.title}
                <ArrowUpRight size={16} />
              </Link>
            ))}
          {!publicEntries.some((e) => e.location === selected) && (
            <p>Belum ada dokumentasi publik.</p>
          )}
        </div>
      </div>
    </>
  );
}
