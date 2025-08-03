import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
} from "./ui/sidebar";

export function SidebarWrapped() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarTrigger />
        <h2 className="text-lg font-semibold px-2">L&A Recipe</h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl font-bold">
            Dietary Preferences
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex items-center space-x-3 font-semibold text-xl p-2 hover:bg-gray-100 rounded cursor-pointer">
                  <input type="checkbox" className="w-6 h-6" id="meat" />
                  <label htmlFor="meat" className="cursor-pointer">
                    🥩 Meat
                  </label>
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <div className="flex items-center space-x-3 font-semibold text-xl p-2 hover:bg-gray-100 rounded cursor-pointer">
                  <input type="checkbox" className="w-6 h-6" id="vegan" />
                  <label htmlFor="vegan" className="cursor-pointer">
                    🌱 Vegan
                  </label>
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <div className="flex items-center space-x-3 font-semibold text-xl p-2 hover:bg-gray-100 rounded cursor-pointer">
                  <input type="checkbox" className="w-6 h-6" id="kosher" />
                  <label htmlFor="kosher" className="cursor-pointer">
                    ✡️ Kosher
                  </label>
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <div className="flex items-center space-x-3 font-semibold text-xl p-2 hover:bg-gray-100 rounded cursor-pointer">
                  <input type="checkbox" className="w-6 h-6" id="dessert" />
                  <label htmlFor="dessert" className="cursor-pointer">
                    🍰 Dessert
                  </label>
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <div className="flex items-center space-x-3 font-semibold text-xl p-2 hover:bg-gray-100 rounded cursor-pointer">
                  <input type="checkbox" className="w-6 h-6" id="gluten-free" />
                  <label htmlFor="gluten-free" className="cursor-pointer">
                    🌾 Gluten Free
                  </label>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl font-bold">
            Cooking Time
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex items-center space-x-3 font-semibold text-xl p-2 hover:bg-gray-100 rounded cursor-pointer">
                  <input type="checkbox" className="w-6 h-6" id="quick" />
                  <label htmlFor="quick" className="cursor-pointer">
                    ⚡ Under 30 min
                  </label>
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <div className="flex items-center space-x-3 font-semibold text-xl p-2 hover:bg-gray-100 rounded cursor-pointer">
                  <input type="checkbox" className="w-6 h-6" id="medium" />
                  <label htmlFor="medium" className="cursor-pointer">
                    ⏰ 30-60 min
                  </label>
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <div className="flex items-center space-x-3 font-semibold text-xl p-2 hover:bg-gray-100 rounded cursor-pointer">
                  <input type="checkbox" className="w-6 h-6" id="long" />
                  <label htmlFor="long" className="cursor-pointer">
                    🕐 Over 1 hour
                  </label>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
