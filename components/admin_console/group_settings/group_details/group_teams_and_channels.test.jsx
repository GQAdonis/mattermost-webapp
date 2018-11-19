// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {shallow} from 'enzyme';

import GroupTeamsAndChannels from 'components/admin_console/group_settings/group_details/group_teams_and_channels.jsx';

describe('components/admin_console/group_settings/group_details/GroupTeamsAndChannels', () => {
    const defaultProps = {
        id: 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
        teams: [
            {
                team_id: '11111111111111111111111111',
                team_type: 'O',
                team_display_name: 'Team 1',
            },
            {
                team_id: '22222222222222222222222222',
                team_type: 'P',
                team_display_name: 'Team 2',
            },
            {
                team_id: '33333333333333333333333333',
                team_type: 'P',
                team_display_name: 'Team 3',
            },
        ],
        channels: [
            {
                team_id: '11111111111111111111111111',
                team_type: 'O',
                team_display_name: 'Team 1',
                channel_id: '44444444444444444444444444',
                channel_type: 'O',
                channel_display_name:'Channel 4',
            },
            {
                team_id: '99999999999999999999999999',
                team_type: 'O',
                team_display_name: 'Team 9',
                channel_id: '55555555555555555555555555',
                channel_type: 'P',
                channel_display_name:'Channel 5',
            },
            {
                team_id: '99999999999999999999999999',
                team_type: 'O',
                team_display_name: 'Team 9',
                channel_id: '55555555555555555555555555',
                channel_type: 'P',
                channel_display_name:'Channel 5',
            },
        ],
        loading: false,
        actions: {
            getGroupSyncables: jest.fn().mockReturnValue(Promise.resolve()),
            unlink: jest.fn(),
        },
    };

    test('should match snapshot, with teams, with channels and loading', () => {
        const wrapper = shallow(<GroupTeamsAndChannels {...defaultProps} loading={true}/>);
        expect(wrapper).toMatchSnapshot();
    });

    test('should match snapshot, with teams, with channels and loaded', () => {
        const wrapper = shallow(<GroupTeamsAndChannels {...defaultProps} loading={false}/>);
        expect(wrapper).toMatchSnapshot();
    });

    test('should match snapshot, without teams, without channels and loading', () => {
        const wrapper = shallow(
            <GroupTeamsAndChannels
                {...defaultProps}
                teams={[]}
                channels={[]}
                loading={true}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should match snapshot, without teams, without channels and loaded', () => {
        const wrapper = shallow(
            <GroupTeamsAndChannels
                {...defaultProps}
                teams={[]}
                channels={[]}
                loading={false}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should toggle the collapse for an element', () => {
        const wrapper = shallow(<GroupTeamsAndChannels {...defaultProps}/>);
        const instance = wrapper.instance()
        expect(Boolean(wrapper.state().collapsed['11111111111111111111111111'])).toBe(false);
        expect(Boolean(wrapper.state().collapsed['22222222222222222222222222'])).toBe(false);
        instance.onToggleCollapse('11111111111111111111111111');
        expect(Boolean(wrapper.state().collapsed['11111111111111111111111111'])).toBe(true);
        expect(Boolean(wrapper.state().collapsed['22222222222222222222222222'])).toBe(false);
        instance.onToggleCollapse('11111111111111111111111111');
        expect(Boolean(wrapper.state().collapsed['11111111111111111111111111'])).toBe(false);
        expect(Boolean(wrapper.state().collapsed['22222222222222222222222222'])).toBe(false);
    });

    test('should remove the item based on the item type', async () => {
        const actions = {
            unlink: jest.fn().mockReturnValue(Promise.resolve()),
            getGroupSyncables: jest.fn().mockReturnValue(Promise.resolve()),
        };
        const wrapper = shallow(<GroupTeamsAndChannels {...defaultProps} actions={actions}/>);
        const instance = wrapper.instance()
        await instance.onRemoveItem('11111111111111111111111111', 'public-team');
        expect(actions.unlink).toBeCalledWith('xxxxxxxxxxxxxxxxxxxxxxxxxx', '11111111111111111111111111', 'team');
        expect(actions.getGroupSyncables).toBeCalledWith('xxxxxxxxxxxxxxxxxxxxxxxxxx', 'team');
        actions.unlink.mockClear()
        actions.getGroupSyncables.mockClear()

        await instance.onRemoveItem('22222222222222222222222222', 'private-team');
        expect(actions.unlink).toBeCalledWith('xxxxxxxxxxxxxxxxxxxxxxxxxx', '22222222222222222222222222', 'team');
        expect(actions.getGroupSyncables).toBeCalledWith('xxxxxxxxxxxxxxxxxxxxxxxxxx', 'team');
        actions.unlink.mockClear()
        actions.getGroupSyncables.mockClear()

        await instance.onRemoveItem('44444444444444444444444444', 'public-channel');
        expect(actions.unlink).toBeCalledWith('xxxxxxxxxxxxxxxxxxxxxxxxxx', '44444444444444444444444444', 'channel');
        expect(actions.getGroupSyncables).toBeCalledWith('xxxxxxxxxxxxxxxxxxxxxxxxxx', 'channel');
        actions.unlink.mockClear()
        actions.getGroupSyncables.mockClear()

        await instance.onRemoveItem('55555555555555555555555555', 'private-channel');
        expect(actions.unlink).toBeCalledWith('xxxxxxxxxxxxxxxxxxxxxxxxxx', '55555555555555555555555555', 'channel');
        expect(actions.getGroupSyncables).toBeCalledWith('xxxxxxxxxxxxxxxxxxxxxxxxxx', 'channel');
    });
});