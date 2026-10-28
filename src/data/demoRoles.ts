/**
 * Demo roles exposed on /auth/demo, grouped by business vertical.
 * Drives the data-driven demo-login tests: add a role here and it gets a test.
 */
export type Vertical = 'Owner & Admin' | 'Billing & Back-office' | 'Hotel & Restaurant' | 'Medical/Pharmacy';

export interface DemoRole {
  name: string;
  vertical: Vertical;
}

export const demoRoles: DemoRole[] = [
  { name: 'Admin', vertical: 'Owner & Admin' },
  { name: 'Invoice User', vertical: 'Billing & Back-office' },
  { name: 'Accountant', vertical: 'Billing & Back-office' },
  { name: 'Inventory Manager', vertical: 'Billing & Back-office' },
  { name: 'Hotel Bearer', vertical: 'Hotel & Restaurant' },
  { name: 'Kitchen Staff', vertical: 'Hotel & Restaurant' },
  { name: 'Doctor', vertical: 'Medical/Pharmacy' },
  { name: 'Nurse', vertical: 'Medical/Pharmacy' },
  { name: 'Pharmacy Manager', vertical: 'Medical/Pharmacy' },
  { name: 'Radiologist', vertical: 'Medical/Pharmacy' },
  { name: 'Lab Technician', vertical: 'Medical/Pharmacy' },
  { name: 'Blood Bank Manager', vertical: 'Medical/Pharmacy' },
];

export const verticals: Vertical[] = [...new Set(demoRoles.map((r) => r.vertical))];
