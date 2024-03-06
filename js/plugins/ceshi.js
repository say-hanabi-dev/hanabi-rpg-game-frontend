var ceshi = window.ceshi || {};






ceshi._GameBattler_addState = Game_Battler.prototype.addState;

Game_Battler.prototype.addState = function (stateId) {

    if (stateId == 71) {
        $dataStates[stateId].traits = []


        this._skills.forEach(function (item) {
            if (item != 404) {
                $dataStates[stateId].traits.push(
                    { "code": 44, "dataId": item, "value": 1 }
                );
            }
        })
        $dataStates[stateId].traits.push(
            { "code": 44, "dataId": 1, "value": 1 }
        );
        $dataStates[stateId].traits.push(
            { "code": 44, "dataId": 2, "value": 1 }
        );
        $dataStates[stateId].traits.push(
            { "code": 43, "dataId": 404, "value": 1 }
        );
        $dataStates[stateId].traits.push(
            { "code": 62, "dataId": 0, "value": 1 }
        );

    }
    ceshi._GameBattler_addState.call(this, stateId);

};
