import Breadcrumbs from "@/ui/Breadcrumbs";
import AddTicketForm from "./components/AddTicketForm";

function AddNewTicketPage() {
  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: "پروفایل",
            href: "/profile",
          },
          {
            label: "پشتیبانی",
            href: "/profile/support",
          },
          {
            label: "افزودن تیکت جدید  ",
            href: "/profile/support/create",
            active: true,
          },
        ]}
      />
      <AddTicketForm />
    </div>
  );
}

export default AddNewTicketPage;
