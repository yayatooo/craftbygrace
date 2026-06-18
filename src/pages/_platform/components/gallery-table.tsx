import { Badge } from "#/components/ui/badge";
import { TableRowActions } from "./table-row-action";

export type GalleryItem = {
  id: string;
  name: string;
  image: string;
  isActive: boolean;
};

type GalleryTableProps = {
  data: GalleryItem[];
};

export function GalleryTable({ data }: GalleryTableProps) {
  async function handleDelete(id: string) {
    console.log("delete", id);

    // nanti ganti dengan server action / mutation:
    // await deleteGalleryAction(id)
  }

  async function handleToggleActive(id: string, value: boolean) {
    console.log("toggle active", id, value);

    // nanti ganti dengan server action / mutation:
    // await updateGalleryActiveAction(id, value)
  }

  function handleEdit(item: GalleryItem) {
    console.log("edit", item);

    // nanti buka Dialog edit:
    // setSelectedItem(item)
    // setEditOpen(true)
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-background">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/40">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Image</th>
            <th className="px-4 py-3 text-left font-medium">Name</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b last:border-b-0">
              <td className="px-4 py-3">
                <div className="size-12 overflow-hidden rounded-xl border bg-muted">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="size-full object-cover"
                  />
                </div>
              </td>

              <td className="px-4 py-3 font-medium">{item.name}</td>

              <td className="px-4 py-3">
                <Badge variant={item.isActive ? "default" : "secondary"}>
                  {item.isActive ? "Active" : "Inactive"}
                </Badge>
              </td>

              <td className="px-4 py-3">
                <TableRowActions
                  id={item.id}
                  name={item.name}
                  isActive={item.isActive}
                  onEdit={() => handleEdit(item)}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
