import { Render } from "@measured/puck";
import type { Config } from "@measured/puck";
 
export function Page() {

  const config: Config = {
    components: {},
  };
  const data = {};   

  return <Render config={config} data={data} />;
}