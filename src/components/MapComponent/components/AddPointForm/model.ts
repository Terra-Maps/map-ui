export default interface IAddPointForm {
  addPOIConfig: any;
  setShowLeftSideBar: (flag: boolean) => void;
  setAddPOIConfig: (config: any) => void; 
  refreshMap: () => void;
}
