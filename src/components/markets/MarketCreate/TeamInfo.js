import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { tu } from './../../../utils/i18n';
import { Form, Row, Col, Input } from 'antd';
import moment from 'moment';
import SweetAlert from 'react-bootstrap-sweetalert';

@connect(
    (state, ownProp) => ({
        account: state.app.account,
        wallet: state.wallet.current,
        form: ownProp.form,
        params: ownProp.params,
    })
)

export class TeamInfo extends Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        params: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }

    showModal = (msg) => {
        let { intl } = this.props;
        this.setState({
            modal: <SweetAlert
                error
                confirmBtnText={intl.formatMessage({ id: 'confirm' })}
                confirmBtnBsStyle="success"
                onConfirm={this.hideModal}
                style={{ marginLeft: '-240px', marginTop: '-195px' }}
            >
                {tu(msg)}
            </SweetAlert>
        }
        );
    }

    hideModal = () => {
        this.setState({
            modal: null,
        });
    };

    render() {
        const { params } = this.props;
        const { teamOverview, howDidYourTeamMeet, teamMembersBased, teamMemberFullTime,
            teamLockUpPlan, technicalOverview, topGithubRep, socialCommunityOverview, competitorOverview,
            DappRadarOrDappReviewRanking, productUsage, roadmap, marketingPlan } = params;
        const { modal } = this.state;
        const { form: { getFieldDecorator } } = this.props;

        // Team Overview item
        const teamOverviewItem = (
            <Col span={24} md={24}>
                <Form.Item label="Team Overview">
                    {getFieldDecorator('teamOverview', {
                        initialValue: teamOverview,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // How did your team meet item
        const teamMeetItem = (
            <Col span={24} md={24}>
                <Form.Item label="How did your team meet">
                    {getFieldDecorator('howDidYourTeamMeet', {
                        initialValue: howDidYourTeamMeet,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Where are all your team members based item
        const teamMembersItem = (
            <Col span={24} md={24}>
                <Form.Item label="Where are all your team members based">
                    {getFieldDecorator('teamMembersBased', {
                        initialValue: teamMembersBased,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // How many full-time team members do you have item
        const fullTimeItem = (
            <Col span={24} md={24}>
                <Form.Item label="How many full-time team members do you have">
                    {getFieldDecorator('teamMemberFullTime', {
                        initialValue: teamMemberFullTime,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // What is your lock up plan for the team and are you willing to do a 1/12th per month lock up
        // schedule for 12-24 months after TRX market listing item
        const lockUpItem = (
            <Col span={24} md={24}>
                <Form.Item
                    label="What is your lock up plan for the team and are you willing to do a 1/12th per month lock up schedule for 12-24 months after TRX market listing">
                    {getFieldDecorator('teamLockUpPlan', {
                        initialValue: teamLockUpPlan,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Technical Overview item
        const technicalItem = (
            <Col span={24} md={24}>
                <Form.Item label="Technical Overview">
                    {getFieldDecorator('technicalOverview', {
                        initialValue: technicalOverview,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Top Github Repositories item
        const gitHubItem = (
            <Col span={24} md={24}>
                <Form.Item label="Top Github Repositories">
                    {getFieldDecorator('topGithubRep', {
                        initialValue: topGithubRep,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Social Community Overview item
        const socialItem = (
            <Col span={24} md={24}>
                <Form.Item label="Social Community Overview">
                    {getFieldDecorator('socialCommunityOverview', {
                        initialValue: socialCommunityOverview,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Competitor Overview item
        const competitorItem = (
            <Col span={24} md={24}>
                <Form.Item label="Competitor Overview">
                    {getFieldDecorator('competitorOverview', {
                        initialValue: competitorOverview,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // DappRadar or DappReview rankings item
        const dappRadarItem = (
            <Col span={24} md={24}>
                <Form.Item label="DappRadar or DappReview rankings">
                    {getFieldDecorator('DappRadarOrDappReviewRanking', {
                        initialValue: DappRadarOrDappReviewRanking,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Product Usage & Metrics (MAU's, DAU's) item
        const productUsageItem = (
            <Col span={24} md={24}>
                <Form.Item label="Product Usage & Metrics (MAU's, DAU's)">
                    {getFieldDecorator('productUsage', {
                        initialValue: productUsage,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Roadmap item
        const roadmapItem = (
            <Col span={24} md={24}>
                <Form.Item label="Roadmap">
                    {getFieldDecorator('roadmap', {
                        initialValue: roadmap,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Marketing Plan item
        const marketingPlanItem = (
            <Col span={24} md={24}>
                <Form.Item label="Marketing Plan">
                    {getFieldDecorator('marketingPlan', {
                        initialValue: marketingPlan,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );
        return (
            <main>
                <h4 className="mb-3 mt-3">Team Information</h4>
                <hr/>
                <Row gutter={24} type="flex" justify="space-between" className="px-2">
                    {teamOverviewItem}
                    {teamMeetItem}
                    {teamMembersItem}
                    {fullTimeItem}
                    {lockUpItem}
                </Row>
                <h4 className="mb-3">Overview</h4>
                <hr/>
                <Row gutter={24} type="flex" justify="space-between" className="px-2">
                    {technicalItem}
                    {gitHubItem}
                    {socialItem}
                    {competitorItem}
                    {dappRadarItem}
                    {productUsageItem}
                    {roadmapItem}
                    {marketingPlanItem}
                </Row>
            </main>
        );
    }
}

// export default Form.create({ name: 'market_info' })(injectIntl(TeamInfo));
export default TeamInfo;