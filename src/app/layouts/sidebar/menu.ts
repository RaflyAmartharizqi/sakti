import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'MENUITEMS.MENU.TEXT',
    isTitle: true
  },
  {
    id: 2,
    label: 'MENUITEMS.DASHBOARD.TEXT',
    icon: 'ri-dashboard-2-line',
    link: '/',
    role: ['Admin', 'Asesi', 'Asesor'],
  },
  {
    id: 4,
    label: 'MENUITEMS.PERENCANAANPROGRAM.TEXT',
    icon: 'ri-calendar-todo-line',
    isCollapsed: true,
    role: ['Admin'],
    subItems: [
      {
        id: 5,
        label: 'MENUITEMS.PERENCANAANPROGRAM.LIST.PROGRAMAUDIT',
        link: '/perencanaan-program/program-audit',
        parentId: 4,
        role: ['Admin'],
      },
    ]
  },
  {
    id: 6,
    label: 'MENUITEMS.PELAKSANAANPROGRAM.TEXT',
    icon: 'ri-draft-line',
    isCollapsed: true,
    role: ['Admin', 'Asesi', 'Asesor'],
    subItems: [
      {
        id: 7,
        label: 'MENUITEMS.PELAKSANAANPROGRAM.LIST.PENGISIANASSESMENTSMKI',
        link: '/pelaksanaan-program/pengisian-smki',
        parentId: 6,
        role: ['Asesi'],
      },
      {
        id: 8,
        label: 'MENUITEMS.PELAKSANAANPROGRAM.LIST.PELAKSANAANAUDITISO',
        link: '/pelaksanaan-program/pelaksanaan-iso',
        parentId: 6,
        role: ['Asesor'],
        jenisAsesor: ['ISO']
      },
      {
        id: 9,
        label: 'MENUITEMS.PELAKSANAANPROGRAM.LIST.PENILAIANVERIFIKASI',
        link: '/pelaksanaan-program/penilaian-verifikasi',
        parentId: 6,
        role: ['Admin', 'Asesor'],
        jenisAsesor: ['SMKI']
      },
    ]
  },
  {
    id: 10,
    label: 'MENUITEMS.MONITORINGTINDAKLANJUT.TEXT',
    icon: 'ri-draft-line',
    isCollapsed: true,
    role: ['Admin', 'Asesi', 'Asesor'],
    subItems: [
      {
        id: 11,
        label: 'MENUITEMS.MONITORINGTINDAKLANJUT.LIST.AUDITLOG',
        link: '/monitoring-tindak-lanjut/audit-log',
        parentId: 10,
        role: ['Admin', 'Asesi', 'Asesor'],
      },
      {
        id: 12,
        label: 'MENUITEMS.MONITORINGTINDAKLANJUT.LIST.REPORT',
        link: '/monitoring-tindak-lanjut/report',
        parentId: 10,
        role: ['Admin', 'Asesi', 'Asesor'],
      },
      {
        id: 13,
        label: 'MENUITEMS.MONITORINGTINDAKLANJUT.LIST.UMPANBALIK',
        link: '/monitoring-tindak-lanjut/umpan-balik-assesment',
        parentId: 10,
        role: ['Admin'],
      },
    ]
  },
  {
    id: 184,
    label: 'MENUITEMS.PENGATURAN.TEXT',
    icon: 'ri-settings-2-line',
    isCollapsed: true,
    role: ['Admin'],
    subItems: [
      {
        id: 185,
        label: 'MENUITEMS.PENGATURAN.LIST.AKTIVASIUSER',
        link: '/pengaturan/aktivasi-user',
        parentId: 184,
        role: ['Admin'],
      },
      {
        id: 186,
        label: 'MENUITEMS.PENGATURAN.LIST.REFERENSIKLAUSULANNEX',
        link: '/pengaturan/referensi-klausul-annex',
        parentId: 184,
        role: ['Admin'],
      },
      {
        id: 187,
        label: 'MENUITEMS.PENGATURAN.LIST.REFERENSIPERTANYAANSMKI',
        link: '/pengaturan/referensi-pertanyaan-smki',
        parentId: 184,
        role: ['Admin'],
      },
      {
        id: 188,
        label: 'MENUITEMS.PENGATURAN.LIST.REFERENSIPERTANYAANAUDITISO',
        link: '/pengaturan/referensi-pertanyaan-audit-iso',
        parentId: 184,
        role: ['Admin'],
      }
    ]
  },
];
