// app/salary-slip/page.tsx
import SalarySlipForm from "@/app/src/components/salary-slip/salary-slip-form";
import Navbar from "@/app/src/components/Header/Navbar";
import Fotters from "@/app/src/components/Footer/fotters";

export default function SalarySlipPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
        <SalarySlipForm />
      </div>
      <Fotters />
    </>
  );
}