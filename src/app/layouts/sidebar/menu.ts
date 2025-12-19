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
    isCollapsed: true,
    subItems: [
      {
        id: 3,
        label: 'MENUITEMS.DASHBOARD.LIST.ANALYTICS',
        link: '/',
        parentId: 2
      }
    ]
  },
  {
    id: 4,
    label: 'MENUITEMS.PERENCANAANPROGRAM.TEXT',
    icon: 'ri-calendar-todo-line',
    isCollapsed: true,
    subItems: [
      {
        id: 5,
        label: 'MENUITEMS.PERENCANAANPROGRAM.LIST.PROGRAMAUDIT',
        link: '/perencanaan-program/program-audit',
        parentId: 4
      },
    ]
  },
  {
    id: 6,
    label: 'MENUITEMS.PELAKSANAANPROGRAM.TEXT',
    icon: 'ri-draft-line',
    isCollapsed: true,
    subItems: [
      {
        id: 7,
        label: 'MENUITEMS.PELAKSANAANPROGRAM.LIST.PENGISIANASSESMENTSMKI',
        link: '/pelaksanaan-program/pengisian-smki',
        parentId: 6
      },
      {
        id: 8,
        label: 'MENUITEMS.PELAKSANAANPROGRAM.LIST.PELAKSANAANAUDITISO',
        link: '/pelaksanaan-program/pelaksanaan-iso',
        parentId: 6
      },
      {
        id: 9,
        label: 'MENUITEMS.PELAKSANAANPROGRAM.LIST.PENILAIANVERIFIKASI',
        link: '/pelaksanaan-program/penilaian-verifikasi',
        parentId: 6
      },
    ]
  },
  {
    id: 184,
    label: 'MENUITEMS.PENGATURAN.TEXT',
    icon: 'ri-settings-2-line',
    isCollapsed: true,
    subItems: [
      {
        id: 185,
        label: 'MENUITEMS.PENGATURAN.LIST.AKTIVASIUSER',
        link: '/pengaturan/aktivasi-user',
        parentId: 184
      },
      {
        id: 186,
        label: 'MENUITEMS.PENGATURAN.LIST.REFERENSIKLAUSULANNEX',
        link: '/pengaturan/referensi-klausul-annex',
        parentId: 184
      },
      {
        id: 187,
        label: 'MENUITEMS.PENGATURAN.LIST.REFERENSIPERTANYAANSMKI',
        link: '/pengaturan/referensi-pertanyaan-smki',
        parentId: 184
      },
      {
        id: 188,
        label: 'MENUITEMS.PENGATURAN.LIST.REFERENSIPERTANYAANAUDITISO',
        link: '/pengaturan/referensi-pertanyaan-audit-iso',
        parentId: 184
      }
    ]
  },
];
