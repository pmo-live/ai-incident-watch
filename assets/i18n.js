// UI strings. Incident content stays in its source language; interface labels switch EN / BM.
window.AIW_I18N = {
  en: {},
  ms: {
    skip:"Langkau ke kandungan", org:"Institut Keselamatan AI Malaysia (MY-AISafe) · AI Malaysia",
    nav_threats:"Risikan ancaman", nav_about:"Mengenai", nav_report:"Laporkan insiden",
    eyebrow:"Fungsi Kepercayaan AI E12 · Pemantauan & Forensik Insiden",
    h1:"Saluran langsung insiden dan ancaman AI",
    sub:"Paparan awam insiden AI, hampir-insiden dan ancaman baharu yang berkaitan dengan Malaysia. Pengimbas menyemak sumber setiap 3 jam; pegawai MY-AISafe menilai dan membendung. Sesiapa sahaja boleh membuat laporan.",
    last_scan:"Imbasan terakhir", next_scan:"Imbasan seterusnya", loading:"Memuatkan",
    k_open:"Insiden terbuka", k_open_f:"Diterima, dinilai atau dibendung", k_near:"Hampir-insiden", k_near_f:"Dikesan sebelum berlaku kemudaratan",
    k_threat:"Ancaman aktif", k_threat_f:"Risiko baharu dan corak penyalahgunaan", k_sev:"Kritikal / Tinggi", k_sev_f:"Item terbuka di tahap amaran awal",
    k_my:"Malaysia / ASEAN", k_my_f:"Item terbuka di rantau ini", k_shared:"Pengajaran dikongsi", k_shared_f:"Ditutup dengan pengajaran diterbitkan",
    inc_h:"Insiden dan hampir-insiden", f_all_init:"Semua inisiatif", f_all_sev:"Semua tahap", f_open:"Terbuka sahaja", f_all_st:"Semua peringkat", search:"Cari",
    inc_d:"Selepas pelepasan: terima, nilai dan bendung insiden AI dan hampir-insiden, kemudian kongsi pengajaran. Bar peringkat menunjukkan kemajuan setiap item.",
    empty_h:"Memuatkan", cta_p:"Pernah melihat sistem AI menyebabkan kemudaratan, bertindak tidak selamat, atau hampir berbuat demikian? Pembangun, pengguna sistem, agensi dan orang awam boleh melaporkannya di sini. Hampir-insiden juga dikira.",
    thr_h:"Risikan ancaman", thr_e:"Amaran awal", thr_d:"Risiko AI baharu dan corak penyalahgunaan yang dijejaki supaya amaran dapat diberi sebelum ia merebak. Ini belum lagi insiden yang disahkan di Malaysia.",
    about_h:"Cara saluran ini berfungsi",
    a_detect:"Kesan", a_detect_d:"Ejen pengimbas mencari sumber awam setiap 3 jam untuk insiden AI, hampir-insiden dan corak ancaman. Setiap item mempunyai tarikh kejadian dan pautan sumber.",
    a_receive:"Terima", a_receive_d:"Laporan daripada orang awam, pembangun, pengguna sistem dan agensi memasuki saluran yang sama melalui borang laporan.",
    a_assess:"Nilai", a_assess_d:"Pegawai MY-AISafe mengklasifikasikan tahap keterukan, mengenal pasti prinsip AIGE yang terjejas dan peringkat kitaran hayat sistem, serta merekod punca.",
    a_contain:"Bendung", a_contain_d:"Tindakan pembendungan diselaraskan dengan pembangun, pengguna sistem atau ketua sektor yang bertanggungjawab.",
    a_share:"Kongsi", a_share_d:"Pengajaran diterbitkan pada item yang ditutup supaya ekosistem dapat bertindak.",
    a_basis:"Asas", a_basis_d:"Pelan Tindakan AI Kebangsaan 2026–2030 inisiatif E12 (Fungsi Kepercayaan AI); Garis Panduan Tadbir Urus dan Etika AI Kebangsaan (AIGE, 2024); kitaran hayat AI ISO/IEC 5338:2023.",
    pipe_h:"Saluran", prin_h:"Prinsip AIGE terjejas", prin_e:"Item terbuka", cls_h:"Tahap keterukan", cls_l:"Tahap", cls_d:"Maksud", cls_r:"Tindak balas",
    init_h:"Inisiatif", scan_h:"Larian pengimbas", scan_e:"10 terakhir", tl_h:"Daripada prinsip kepada institut",
    tl1:"Garis Panduan Tadbir Urus dan Etika AI Kebangsaan (AIGE) diterbitkan", tl2:"Pejabat AI Kebangsaan dilancarkan", tl3:"Perundingan awam Rang Undang-Undang Tadbir Urus AI",
    tl4:"AI Malaysia dilancarkan bersama Pelan Tindakan AI Kebangsaan 2026–2030 dan MY-AISafe", tl5:"Rang Undang-Undang Tadbir Urus AI disasarkan dibentangkan di Parlimen",
    foot_l:"Institut Keselamatan AI Malaysia (MY-AISafe), satu fungsi AI Malaysia Berhad di bawah Kementerian Digital.", foot_r:"Pertanyaan", foot_u:"Data dikemas kini",
    // dynamic
    stage_Received:"Diterima", stage_Assessed:"Dinilai", stage_Contained:"Dibendung", stage_Shared:"Dikongsi",
    kind_incident:"Insiden", kind_near:"Hampir-insiden", kind_threat:"Corak ancaman", event:"Kejadian", received:"Diterima", source:"Sumber", nosrc:"Tiada pautan sumber",
    lessons:"Pengajaran", warn_title:"Amaran awal: {n} item belum dinilai · tertinggi {s}", none_inc:"Tiada insiden sepadan", none_thr:"Tiada corak ancaman sepadan", try:"Cuba Semua peringkat atau kosongkan carian.",
    static:"Dikemas kini setiap 3 jam", notyet:"Belum dinilai", noscan:"Tiada larian direkodkan", new:"baharu", warn:"amaran", open:"terbuka",
    sev_Critical:"Kritikal", sev_High:"Tinggi", sev_Medium:"Sederhana", sev_Low:"Rendah",
    goal:"Matlamat saluran ini", facts:"Fakta utama", watch:"Senarai pantau", sources:"Sumber", owner:"Pemilik"
  }
};
// Report page strings
window.AIW_I18N.ms_report = {
  r_h:"Laporkan insiden AI", r_sub:"Gunakan borang ini untuk melaporkan sistem AI yang menyebabkan kemudaratan, bertindak tidak selamat, atau hampir berbuat demikian. Laporan diterima oleh MY-AISafe dan masuk ke saluran Terima → Nilai → Bendung → Kongsi.",
  r_notice:"Untuk kecemasan yang membahayakan nyawa, hubungi 999. Untuk penipuan dalam talian, hubungi Pusat Respons Scam Kebangsaan (NSRC) 997. Borang ini bukan talian kecemasan.",
  r_what:"Apa yang berlaku", r_type:"Jenis laporan", r_t_inc:"Insiden (kemudaratan berlaku)", r_t_near:"Hampir-insiden (kemudaratan dielakkan)", r_t_thr:"Ancaman atau corak penyalahgunaan",
  r_title:"Tajuk ringkas", r_desc:"Terangkan apa yang berlaku", r_desc_h:"Apa yang dilakukan sistem AI, siapa yang terjejas, dan bagaimana ia dikesan.",
  r_date:"Tarikh kejadian", r_state:"Negeri / lokasi", r_system:"Sistem AI terlibat", r_system_h:"Nama produk, model atau perkhidmatan jika diketahui",
  r_harm:"Kemudaratan atau risiko", r_harm_h:"Pilih semua yang berkenaan",
  h_safety:"Keselamatan fizikal", h_privacy:"Privasi atau data peribadi", h_finance:"Kerugian kewangan atau penipuan", h_fair:"Diskriminasi atau bias", h_info:"Maklumat palsu atau deepfake", h_security:"Keselamatan siber", h_other:"Lain-lain",
  r_sev:"Keterukan yang anda cadangkan", r_sev_h:"Pegawai akan mengesahkan tahap akhir",
  r_who:"Mengenai anda", r_role:"Anda melapor sebagai", role_dev:"Pembangun", role_dep:"Pengguna sistem / organisasi", role_gov:"Agensi kerajaan atau pengawal selia", role_res:"Penyelidik", role_pub:"Orang awam", role_media:"Media",
  r_org:"Organisasi (pilihan)", r_email:"E-mel untuk susulan (pilihan)", r_email_h:"Hanya digunakan oleh pegawai MY-AISafe untuk menghubungi anda tentang laporan ini.",
  r_link:"Pautan bukti (pilihan)", r_consent:"Saya faham laporan ini akan dinilai oleh MY-AISafe dan ringkasan tanpa nama boleh diterbitkan pada saluran awam.",
  r_submit:"Hantar laporan", r_back:"Kembali ke papan pemuka"
};
